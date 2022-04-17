resource "aws_vpc" "main" {
  cidr_block           = "10.1.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_subnet" "private" {
  count             = 2
  availability_zone = var.availability_zones[count.index]
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
}

resource "aws_db_subnet_group" "app_rds" {
  name       = "app-rds"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_vpc_endpoint" "app_endpoint" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.ap-northeast-1.rds-data"
  subnet_ids          = aws_subnet.private[*].id
  private_dns_enabled = true
  vpc_endpoint_type   = "Interface"
  tags = {
    Name : "flac_data_api"
  }
}
