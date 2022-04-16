use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Bidding {
    pub id: String,
    pub amount: i64,
    pub bidder_id: String,
    pub bidder_name: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Auction {
    pub id: String,
    pub title: String,
    pub description: String,
    pub close_at: String,
    pub owner_id: String,
    pub owner_name: String,
    pub bidding_history: Vec<Bidding>,
    pub created_at: String,
}
