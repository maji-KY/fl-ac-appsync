data "local_file" "graphql_schema" {
  filename = "../schema.graphql"
}

data "local_file" "auctions_zip" {
  filename = "../artifact/auctions.zip"
}

data "local_file" "auction_zip" {
  filename = "../artifact/auction.zip"
}

data "local_file" "create_auction_zip" {
  filename = "../artifact/create_auction.zip"
}

data "local_file" "bid_zip" {
  filename = "../artifact/bid.zip"
}
