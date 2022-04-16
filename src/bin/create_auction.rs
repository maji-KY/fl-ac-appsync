use aws_sdk_rdsdata::Client;
use fl_ac_appsync::arg;
use fl_ac_appsync::auth;
use fl_ac_appsync::database;
use fl_ac_appsync::logger;
use lambda_runtime::{service_fn, LambdaEvent};
use serde_json::Value;
use tracing::info;

type Response = Result<Value, lambda_runtime::Error>;

#[tokio::main]
async fn main() -> Result<(), lambda_runtime::Error> {
    logger::init_logger()?;
    let func = service_fn(handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

async fn handler(event: LambdaEvent<Value>) -> Response {
    let result = auth::with_auth(event.payload, |user, arguments| async move {
        let config = aws_config::from_env().region("ap-northeast-1").load().await;
        info!("Args: {}", arguments);
        let input = arg::extract_input(&arguments)?;
        let title = arg::extract_arg_string(input, "title")?;
        let description = arg::extract_arg_string(input, "description")?;
        let client = Client::new(&config);
        let id = database::create_auction(&client, title, description, user).await?;
        info!("Create Successful: {}", id);
        let result = database::select_auction_by_id(&client, id).await?;
        info!("Query Successful");
        Ok(serde_json::to_value(result)?)
    })
    .await?;
    Ok(result)
}
