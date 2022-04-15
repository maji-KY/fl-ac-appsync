resource "aws_kms_key" "rds_kms_key" {
  description             = "rds_kms_key"
  deletion_window_in_days = 7
}

resource "aws_secretsmanager_secret" "rds_cred" {
  name                    = "rds_cred"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "rds_cred_ver" {
  secret_id = aws_secretsmanager_secret.rds_cred.id
  secret_string = jsonencode({
    engine : "mysql"
    host : aws_rds_cluster.db.endpoint
    username : aws_rds_cluster.db.master_username
    password : aws_rds_cluster.db.master_password
    dbname : aws_rds_cluster.db.database_name
    port : "3306"
  })
}

resource "aws_security_group" "rds_security_group" {
  vpc_id = aws_vpc.main.id
  name   = "app_security_group"

  ingress {
    protocol    = "tcp"
    from_port   = 3306
    to_port     = 3306
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name : "flac"
  }
}

resource "random_password" "db" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_rds_cluster" "db" {
  cluster_identifier     = "fl-ac-db-cluster"
  engine_mode            = "serverless"
  engine                 = "aurora-mysql"
  engine_version         = "5.7"
  database_name          = "app"
  master_username        = "flac"
  master_password        = random_password.db.result
  db_subnet_group_name   = aws_db_subnet_group.app_rds.name
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
  enable_http_endpoint   = true
  kms_key_id             = aws_kms_key.rds_kms_key.arn
  storage_encrypted      = true

  scaling_configuration {
    auto_pause               = true
    seconds_until_auto_pause = 300
    max_capacity             = 1
    min_capacity             = 1
    timeout_action           = "RollbackCapacityChange"
  }
}
