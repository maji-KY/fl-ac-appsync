use crate::auth;
use crate::model;
use aws_sdk_rdsdata::client::fluent_builders::ExecuteStatement;
use aws_sdk_rdsdata::model::sql_parameter::Builder;
use aws_sdk_rdsdata::model::Field;
use aws_sdk_rdsdata::Client;
use chrono::TimeZone;
use rdsdata_mapper::params::BindParam;
use rdsdata_mapper::RdsdataMapper;
use std::env;
use std::ops::Add;
use ulid::Ulid;

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

type BiddingRawRecords = Vec<Vec<Field>>;

impl TryFrom<BiddingRecord> for model::Bidding {
    type Error = anyhow::Error;

    fn try_from(value: BiddingRecord) -> Result<Self, Self::Error> {
        Ok(model::Bidding {
            id: value.id,
            amount: value.amount,
            bidder_id: value.bidder_id,
            bidder_name: value.bidder_name,
            created_at: format_datetime(value.created_at)?,
        })
    }
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

type AuctionRawRecord = Vec<Field>;

impl TryFrom<(AuctionRecord, Vec<model::Bidding>)> for model::Auction {
    type Error = anyhow::Error;

    fn try_from(value: (AuctionRecord, Vec<model::Bidding>)) -> Result<Self, Self::Error> {
        let (record, bidding_history) = value;
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
}

#[test]
fn it_works() {
    assert_eq!(
        BiddingRecord::select("where id = :id"),
        "select id,auction_id,amount,bidder_id,bidder_name,created_at from bidding where id = :id"
    );
    assert_eq!(AuctionRecord::select("where id = :id"), "select id,title,description,close_at,owner_id,owner_name,created_at from auction where id = :id");
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
    auction_row: AuctionRawRecord,
    bidding_rows: BiddingRawRecords,
) -> anyhow::Result<model::Auction> {
    let bidding_history = bidding_rows
        .into_iter()
        .map(|x| Ok(model::Bidding::try_from(BiddingRecord::try_from(x)?)?))
        .collect::<anyhow::Result<Vec<model::Bidding>>>()?;
    model::Auction::try_from((AuctionRecord::try_from(auction_row)?, bidding_history))
}

pub async fn select_auctions(client: &Client) -> anyhow::Result<Vec<model::Auction>> {
    let auction_results = get_statement(client)?
        .sql(AuctionRecord::select("order by id desc"))
        .send()
        .await?;
    let auction_rows = auction_results.records.ok_or(DBError::NotFound)?;
    auction_rows
        .into_iter()
        .map(|row| extract_auction(row, vec![]))
        .collect()
}

pub async fn select_auction_by_id(client: &Client, id: String) -> anyhow::Result<model::Auction> {
    let auction_results = get_statement(client)?
        .sql(AuctionRecord::select("where id = :id"))
        .bind_param("id", id.to_string())
        .send()
        .await?;
    let auction_rows = auction_results.records.ok_or(DBError::NotFound)?;
    if auction_rows.len() != 1 {
        return Err(anyhow::Error::from(DBError::NotFound));
    }
    let bidding_results = get_statement(client)?
        .sql(BiddingRecord::select(
            "where auction_id = :id order by id desc",
        ))
        .bind_param("id", id.to_string())
        .send()
        .await?;
    let bidding_rows = bidding_results.records.ok_or(DBError::NotFound)?;
    let auction_row = auction_rows[0].to_owned();
    extract_auction(auction_row, bidding_rows)
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
        .bind_param("id", id.to_string())
        .bind_param("title", title)
        .bind_param("description", description)
        .bind_param("close_at", close_datetime)
        .bind_param("owner_id", user.email)
        .bind_param("owner_name", user.nickname)
        .bind_param("created_at", now)
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
        .bind_param("id", id.to_string())
        .bind_param("auction_id", auction_id)
        .bind_param("amount", amount)
        .bind_param("bidder_id", user.email)
        .bind_param("bidder_name", user.nickname)
        .bind_param("created_at", now)
        .send().await?;
    if auction_results.number_of_records_updated != 1 {
        return Err(anyhow::Error::from(DBError::UpdateFailed));
    }
    Ok(id)
}

#[derive(Debug, RdsdataMapper)]
#[rdsdata_mapper(table_name = "sample")]
struct SampleRecord {
    string_value: String,
    #[rdsdata_mapper(column_name = "maybe_string")]
    nullable_string_value: Option<String>,
    float_value: f64,
    long_value: i64,
    bool_value: bool,
}

#[test]
fn it_works2() {
    assert_eq!(SampleRecord::select("where string_value = :value"), "select string_value,maybe_string,float_value,long_value,bool_value from sample where string_value = :value");
}
