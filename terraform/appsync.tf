resource "aws_appsync_graphql_api" "app" {
  name                = "flac"
  authentication_type = "OPENID_CONNECT"
  openid_connect_config {
    issuer = "https://l0v0l.auth0.com/"
  }
  schema       = data.local_file.graphql_schema.content
  xray_enabled = true
  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.appsync_role.arn
    field_log_level          = "ERROR"
  }
}

resource "aws_appsync_datasource" "auctions_data" {
  api_id           = aws_appsync_graphql_api.app.id
  name             = "auctions_data"
  service_role_arn = aws_iam_role.appsync_datasource_role.arn
  type             = "AWS_LAMBDA"
  lambda_config {
    function_arn = aws_lambda_function.auctions.arn
  }
}

resource "aws_appsync_resolver" "auctions_resolver" {
  api_id      = aws_appsync_graphql_api.app.id
  type        = "Query"
  field       = "auctions"
  data_source = aws_appsync_datasource.auctions_data.name
}

resource "aws_appsync_datasource" "auction_data" {
  api_id           = aws_appsync_graphql_api.app.id
  name             = "auction_data"
  service_role_arn = aws_iam_role.appsync_datasource_role.arn
  type             = "AWS_LAMBDA"
  lambda_config {
    function_arn = aws_lambda_function.auction.arn
  }
}

resource "aws_appsync_resolver" "auction_resolver" {
  api_id      = aws_appsync_graphql_api.app.id
  type        = "Query"
  field       = "auction"
  data_source = aws_appsync_datasource.auction_data.name
}

resource "aws_appsync_datasource" "create_auction_data" {
  api_id           = aws_appsync_graphql_api.app.id
  name             = "create_auction_data"
  service_role_arn = aws_iam_role.appsync_datasource_role.arn
  type             = "AWS_LAMBDA"
  lambda_config {
    function_arn = aws_lambda_function.create_auction.arn
  }
}

resource "aws_appsync_resolver" "create_auction_resolver" {
  api_id      = aws_appsync_graphql_api.app.id
  type        = "Mutation"
  field       = "createAuction"
  data_source = aws_appsync_datasource.create_auction_data.name
}

resource "aws_appsync_datasource" "bid_data" {
  api_id           = aws_appsync_graphql_api.app.id
  name             = "bid_data"
  service_role_arn = aws_iam_role.appsync_datasource_role.arn
  type             = "AWS_LAMBDA"
  lambda_config {
    function_arn = aws_lambda_function.bid.arn
  }
}

resource "aws_appsync_resolver" "bid_resolver" {
  api_id      = aws_appsync_graphql_api.app.id
  type        = "Mutation"
  field       = "bid"
  data_source = aws_appsync_datasource.bid_data.name
}

resource "aws_appsync_resolver" "on_update_auction_resolver" {
  api_id      = aws_appsync_graphql_api.app.id
  type        = "Subscription"
  field       = "onUpdateAuction"
  data_source = aws_appsync_datasource.auction_data.name
}
