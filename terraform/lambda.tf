resource "aws_lambda_function" "auctions" {
  function_name    = "auctions"
  description      = "flac"
  handler          = "lambda.handler"
  role             = aws_iam_role.lambda_runtime_role.arn
  runtime          = "provided.al2"
  filename         = data.local_file.auctions_zip.filename
  source_code_hash = filebase64sha256(data.local_file.auctions_zip.filename)

  environment {
    variables = {
      RUST_LOG = "info"
    }
  }

  tracing_config {
    mode = "Active"
  }

  depends_on = [
    aws_cloudwatch_log_group.auctions,
  ]
}

resource "aws_cloudwatch_log_group" "auctions" {
  name              = "/aws/lambda/auctions"
  retention_in_days = 7
}

resource "aws_lambda_function" "auction" {
  function_name    = "auction"
  description      = "flac"
  handler          = "lambda.handler"
  role             = aws_iam_role.lambda_runtime_role.arn
  runtime          = "provided.al2"
  filename         = data.local_file.auction_zip.filename
  source_code_hash = filebase64sha256(data.local_file.auction_zip.filename)

  environment {
    variables = {
      RUST_LOG = "info"
    }
  }

  tracing_config {
    mode = "Active"
  }

  depends_on = [
    aws_cloudwatch_log_group.auction,
  ]
}

resource "aws_cloudwatch_log_group" "auction" {
  name              = "/aws/lambda/auction"
  retention_in_days = 7
}

resource "aws_lambda_function" "create_auction" {
  function_name    = "create_auction"
  description      = "flac"
  handler          = "lambda.handler"
  role             = aws_iam_role.lambda_runtime_role.arn
  runtime          = "provided.al2"
  filename         = data.local_file.create_auction_zip.filename
  source_code_hash = filebase64sha256(data.local_file.create_auction_zip.filename)

  environment {
    variables = {
      RUST_LOG = "info"
    }
  }

  tracing_config {
    mode = "Active"
  }

  depends_on = [
    aws_cloudwatch_log_group.create_auction,
  ]
}

resource "aws_cloudwatch_log_group" "create_auction" {
  name              = "/aws/lambda/create_auction"
  retention_in_days = 7
}

resource "aws_lambda_function" "bid" {
  function_name    = "bid"
  description      = "flac"
  handler          = "lambda.handler"
  role             = aws_iam_role.lambda_runtime_role.arn
  runtime          = "provided.al2"
  filename         = data.local_file.bid_zip.filename
  source_code_hash = filebase64sha256(data.local_file.bid_zip.filename)

  environment {
    variables = {
      RUST_LOG = "info"
    }
  }

  tracing_config {
    mode = "Active"
  }

  depends_on = [
    aws_cloudwatch_log_group.bid,
  ]
}

resource "aws_cloudwatch_log_group" "bid" {
  name              = "/aws/lambda/bid"
  retention_in_days = 7
}
