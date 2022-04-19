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
use rdsdata_mapper::typeclass::MapTo;
use rdsdata_mapper::RdsdataMapper;

#[derive(Debug, RdsdataMapper)]
#[rdsdata_mapper(table_name = "bidding")]
pub struct BiddingRecord {
    pub id: String,
    pub auction_id: String,
    pub amount: i64,
    pub bidder_id: String,
    pub bidder_name: String,
    pub created_at: String,
}

#[derive(Debug, RdsdataMapper)]
#[rdsdata_mapper(table_name = "auction")]
pub struct AuctionRecord {
    pub id: String,
    pub title: String,
    pub description: String,
    pub close_at: String,
    pub owner_id: String,
    pub owner_name: String,
    pub created_at: String,
}

#[cfg(test)]
mod tests {
    use crate::database::BiddingRecord;
    use crate::database::AuctionRecord;
    #[test]
    fn it_works() {
        assert_eq!(BiddingRecord::select("where id = :id"), "select id,auction_id,amount,bidder_id,bidder_name,created_at from bidding where id = :id");
        assert_eq!(AuctionRecord::select("where id = :id"), "select id,title,description,close_at,owner_id,owner_name,created_at from auction where id = :id");
    }
}

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

fn format_datetime(input: String) -> anyhow::Result<String> {
    Ok(chrono::Utc
        .datetime_from_str(input.as_str(), "%Y-%m-%d %H:%M:%S")?
        .to_rfc3339())
}

fn extract_auction(
    row: &Vec<Field>,
    bidding_history: Vec<model::Bidding>,
) -> anyhow::Result<model::Auction> {
    let record: AuctionRecord = row.map_to_model()?;
    Ok(model::Auction {
        id: record.id,
        title: record.title,
        description: record.description,
        close_at: format_datetime(record.close_at)?,
        owner_id: record.owner_id,
        owner_name: record.owner_name,
        bidding_history,
        created_at: format_datetime(record.created_at)?,
    })
}

fn extract_bidding(rows: Vec<Vec<Field>>) -> anyhow::Result<Vec<model::Bidding>> {
    rows
        .into_iter()
        .map(|row| {
            let record: BiddingRecord = row.map_to_model()?;
            Ok(model::Bidding {
                id: record.id,
                amount: record.amount,
                bidder_id: record.bidder_id,
                bidder_name: record.bidder_name,
                created_at: format_datetime(record.created_at)?,
            })
        })
        .collect()
}

pub async fn select_auctions(client: &Client) -> anyhow::Result<Vec<model::Auction>> {
    let auction_results = get_statement(client)?
        .sql(AuctionRecord::select("order by id desc"))
        .send().await?;
    let auction_rows = auction_results.records.ok_or(DBError::NotFound)?;
    auction_rows
        .into_iter()
        .map(|row| extract_auction(&row, vec![]))
        .collect()
}

pub async fn select_auction_by_id(client: &Client, id: String) -> anyhow::Result<model::Auction> {
    let auction_results = get_statement(client)?
        .sql(AuctionRecord::select("where id = :id"))
        .parameters(Builder::default().name("id").value(Field::StringValue(id.to_string())).build())
        .send().await?;
    let auction_rows = auction_results.records.ok_or(DBError::NotFound)?;
    if auction_rows.len() != 1 {
        return Err(anyhow::Error::from(DBError::NotFound));
    }
    let bidding_results = get_statement(client)?
        .sql(BiddingRecord::select("where auction_id = :id order by id desc"))
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
