resource "aws_iam_role" "appsync_role" {
  name = "appsync_role"
  path = "/flac/"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "appsync.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "appsync_role_attachment" {
  role       = aws_iam_role.appsync_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs"
}

resource "aws_iam_role" "appsync_datasource_role" {
  name = "appsync_datasource_role"
  path = "/flac/"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "appsync.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_invoke_policy" {
  name = "lambda_invoke_policy"
  role = aws_iam_role.appsync_datasource_role.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "lambda:InvokeFunction"
        ],
        "Resource" : [
          "arn:aws:lambda:*:${data.aws_caller_identity.self.account_id}:function:*"
        ]
      }
    ]
  })
}

resource "aws_iam_role" "lambda_runtime_role" {
  name = "lambda_runtime_role"
  path = "/flac/"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_runtime_policy" {
  name = "lambda_runtime_policy"
  role = aws_iam_role.lambda_runtime_role.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogStream",
          "logs:CreateLogGroup",
          "logs:PutLogEvents",
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
        ],
        "Resource" : [
          "arn:aws:logs:*:${data.aws_caller_identity.self.account_id}:*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "data_api_policy" {
  name = "data_api_policy"
  role = aws_iam_role.lambda_runtime_role.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "SecretsManagerDbCredentialsAccess",
        "Effect" : "Allow",
        "Action" : [
          "secretsmanager:GetSecretValue"
        ],
        "Resource" : aws_secretsmanager_secret.rds_cred.arn
      },
      {
        "Sid" : "RDSDataServiceAccess",
        "Effect" : "Allow",
        "Action" : [
          "rds-data:BatchExecuteStatement",
          "rds-data:BeginTransaction",
          "rds-data:CommitTransaction",
          "rds-data:ExecuteStatement",
          "rds-data:RollbackTransaction"
        ],
        "Resource" : aws_rds_cluster.db.arn
      }
    ]
  })
}
