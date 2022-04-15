terraform {
  required_version = "~> 1.0.0"
  backend "s3" {
    key    = "fl-ac-appsync/terraform.tfstate"
    region = "ap-northeast-1"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = var.default_tags
  }
}
