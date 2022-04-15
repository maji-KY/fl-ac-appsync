output "aurora_arn" {
  value = aws_rds_cluster.db.arn
}

output "aurora_secret_arn" {
  value = aws_secretsmanager_secret.rds_cred.arn
}
