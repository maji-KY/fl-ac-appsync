use crate::auth;
use crate::model;
use aws_sdk_rdsdata::client::fluent_builders::ExecuteStatement;
use aws_sdk_rdsdata::model::sql_parameter::Builder;
use aws_sdk_rdsdata::model::Field;
use aws_sdk_rdsdata::Client;
use chrono::TimeZone;
use std::env;
use std::ops::Add;
use ulid::Ulid;

#[derive(thiserror::Error, Debug)]
pub enum DBError {
    #[error("record not found")]
    NotFound,
    #[error("value convert failed: {0}")]
    ConvertFailed(String),
    #[error("update failed")]
    UpdateFailed,
}

pub fn get_statement(client: &Client) -> anyhow::Result<ExecuteStatement> {
    let resource_arn = env::var("RESOURCE_ARN")?;
    let secret_arn = env::var("SECRET_ARN")?;
    let statement = client
        .execute_statement()
        .resource_arn(resource_arn)
        .database("app")
        .secret_arn(secret_arn);
    Ok(statement)
}

fn as_string(field: &Field) -> anyhow::Result<String> {
    Ok(field
        .as_string_value()
        .map_err(|_| DBError::ConvertFailed(format!("{:?}", field)))?
        .to_string())
}

fn format_datetime(input: String) -> anyhow::Result<String> {
    Ok(chrono::Utc
        .datetime_from_str(input.as_str(), "%Y-%m-%d %H:%M:%S")?
        .to_rfc3339())
}

fn extract_auction(
    row: &Vec<Field>,
    bidding_history: Vec<model::Bidding>,
) -> anyhow::Result<model::Auction> {
    Ok(model::Auction {
        id: as_string(&row[0])?,
        title: as_string(&row[1])?,
        description: as_string(&row[2])?,
        close_at: format_datetime(as_string(&row[3])?)?,
        owner_id: as_string(&row[4])?,
        owner_name: as_string(&row[5])?,
        bidding_history,
        created_at: format_datetime(as_string(&row[6])?)?,
    })
}

fn extract_bidding(rows: Vec<Vec<Field>>) -> anyhow::Result<Vec<model::Bidding>> {
    let result: Result<Vec<model::Bidding>, anyhow::Error> = rows
        .into_iter()
        .map(|row| {
            Ok(model::Bidding {
                id: as_string(&row[0])?,
                amount: *row[1]
                    .as_long_value()
                    .map_err(|_| DBError::ConvertFailed(format!("{:?}", row[1])))?,
                bidder_id: as_string(&row[2])?,
                bidder_name: as_string(&row[3])?,
                created_at: format_datetime(as_string(&row[4])?)?,
            })
        })
        .collect();
    Ok(result?)
}

pub async fn select_auctions(client: &Client) -> anyhow::Result<Vec<model::Auction>> {
    let auction_results = get_statement(client)?
        .sql("select id,title,description,close_at,owner_id,owner_name,created_at from auction order by created_at desc")
        .send().await?;
    let auction_rows = auction_results.records.ok_or(DBError::NotFound)?;
    auction_rows
        .into_iter()
        .map(|row| extract_auction(&row, vec![]))
        .collect()
}

pub async fn select_auction_by_id(client: &Client, id: String) -> anyhow::Result<model::Auction> {
    let auction_results = get_statement(client)?
        .sql("select id,title,description,close_at,owner_id,owner_name,created_at from auction where id = :id")
        .parameters(Builder::default().name("id").value(Field::StringValue(id.to_string())).build())
        .send().await?;
    let auction_rows = auction_results.records.ok_or(DBError::NotFound)?;
    if auction_rows.len() != 1 {
        return Err(anyhow::Error::from(DBError::NotFound));
    }
    let bidding_results = get_statement(client)?
        .sql("select id,amount,bidder_id,bidder_name,created_at from bidding where auction_id = :id order by created_at desc")
        .parameters(Builder::default().name("id").value(Field::StringValue(id)).build())
        .send().await?;
    let bidding_rows = bidding_results.records.ok_or(DBError::NotFound)?;
    let auction_row = &auction_rows[0];
    extract_auction(auction_row, extract_bidding(bidding_rows)?)
}

pub async fn create_auction(
    client: &Client,
    title: String,
    description: String,
    user: auth::User,
) -> anyhow::Result<String> {
    let id = Ulid::new().to_string();
    let now = chrono::Utc::now();
    let close_datetime = now.add(chrono::Duration::days(7));
    let auction_results = get_statement(client)?
        .sql("insert into auction (id,title,description,close_at,owner_id,owner_name,created_at) values (:id, :title, :description, :close_at, :owner_id, :owner_name, :created_at)")
        .parameters(Builder::default().name("id").value(Field::StringValue(id.to_string())).build())
        .parameters(Builder::default().name("title").value(Field::StringValue(title)).build())
        .parameters(Builder::default().name("description").value(Field::StringValue(description)).build())
        .parameters(Builder::default().name("close_at").value(Field::StringValue(close_datetime.format("%Y-%m-%d %H:%M:%S").to_string())).build())
        .parameters(Builder::default().name("owner_id").value(Field::StringValue(user.email)).build())
        .parameters(Builder::default().name("owner_name").value(Field::StringValue(user.nickname)).build())
        .parameters(Builder::default().name("created_at").value(Field::StringValue(now.format("%Y-%m-%d %H:%M:%S").to_string())).build())
        .send().await?;
    if auction_results.number_of_records_updated != 1 {
        return Err(anyhow::Error::from(DBError::UpdateFailed));
    }
    Ok(id)
}

pub async fn create_bidding(
    client: &Client,
    auction_id: String,
    amount: i64,
    user: auth::User,
) -> anyhow::Result<String> {
    let id = Ulid::new().to_string();
    let now = chrono::Utc::now();
    let auction_results = get_statement(client)?
        .sql("insert into bidding (id,auction_id,amount,bidder_id,bidder_name,created_at) values (:id, :auction_id, :amount, :bidder_id, :bidder_name, :created_at);")
        .parameters(Builder::default().name("id").value(Field::StringValue(id.to_string())).build())
        .parameters(Builder::default().name("auction_id").value(Field::StringValue(auction_id)).build())
        .parameters(Builder::default().name("amount").value(Field::LongValue(amount)).build())
        .parameters(Builder::default().name("bidder_id").value(Field::StringValue(user.email)).build())
        .parameters(Builder::default().name("bidder_name").value(Field::StringValue(user.nickname)).build())
        .parameters(Builder::default().name("created_at").value(Field::StringValue(now.format("%Y-%m-%d %H:%M:%S").to_string())).build())
        .send().await?;
    if auction_results.number_of_records_updated != 1 {
        return Err(anyhow::Error::from(DBError::UpdateFailed));
    }
    Ok(id)
}
