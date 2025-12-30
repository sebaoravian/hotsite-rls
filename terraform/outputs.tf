# ==========================================
# Terraform Outputs
# ==========================================

# ==========================================
# Database Outputs
# ==========================================

output "database_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = false
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.postgres.db_name
  sensitive   = false
}

output "database_url" {
  description = "Full PostgreSQL connection URL"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.endpoint}/${var.db_name}"
  sensitive   = true
}

output "database_secret_arn" {
  description = "ARN of the Secrets Manager secret containing database credentials"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

# ==========================================
# Amplify Outputs
# ==========================================

output "amplify_app_id" {
  description = "Amplify App ID"
  value       = aws_amplify_app.main.id
}

output "amplify_default_domain" {
  description = "Default Amplify domain"
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.main.default_domain}"
}

output "amplify_app_url" {
  description = "Main application URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.main.default_domain}"
}

output "amplify_branch_name" {
  description = "Deployed branch name"
  value       = aws_amplify_branch.main.branch_name
}

# ==========================================
# Domain & SSL Outputs
# ==========================================

output "custom_domain_status" {
  description = "Custom domain configuration status"
  value       = var.domain_name != "" ? "Configured - Verify DNS records" : "Not configured - Using Amplify default domain"
}

output "domain_dns_records" {
  description = "DNS records to configure (if using custom domain)"
  value = var.domain_name != "" ? {
    message = "Configure these DNS records in your domain registrar:"
    records = "Check AWS Amplify Console for CNAME records"
    note    = "SSL certificate will be automatically provisioned by AWS Certificate Manager"
  } : null
}

# ==========================================
# Network Outputs
# ==========================================

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "rds_security_group_id" {
  description = "RDS security group ID"
  value       = aws_security_group.rds.id
}

# ==========================================
# Quick Access Commands
# ==========================================

output "quick_commands" {
  description = "Quick access commands for common tasks"
  sensitive   = true
  value = {
    view_logs              = "aws amplify get-app --app-id ${aws_amplify_app.main.id}"
    view_database_info     = "aws rds describe-db-instances --db-instance-identifier ${aws_db_instance.postgres.identifier}"
    get_database_password  = "aws secretsmanager get-secret-value --secret-id ${aws_secretsmanager_secret.db_credentials.id} --query SecretString --output text | jq -r '.password'"
    connect_to_database    = "psql postgresql://${var.db_username}@${aws_db_instance.postgres.endpoint}/${var.db_name}"
    redeploy_app          = "aws amplify start-job --app-id ${aws_amplify_app.main.id} --branch-name ${aws_amplify_branch.main.branch_name} --job-type RELEASE"
  }
}

# ==========================================
# Cost Estimation
# ==========================================

output "estimated_monthly_cost" {
  description = "Estimated monthly AWS costs (USD)"
  value = {
    rds_postgres = var.db_instance_class == "db.t3.micro" ? "$15-20 (20GB storage)" : "$30-50 (depends on instance)"
    amplify      = "$5-15 (depends on traffic, 1000 build minutes free)"
    data_transfer = "$1-5 (first 100GB free)"
    secrets      = "$0.40 (per secret)"
    total        = "$20-35/month (low traffic estimate)"
    note         = "Costs may vary based on actual usage. Free tier can reduce costs significantly in first 12 months."
  }
}

# ==========================================
# Next Steps
# ==========================================

output "next_steps" {
  description = "Next steps after deployment"
  value = {
    step_1 = "1. Wait for database to be available (~5-10 min)"
    step_2 = "2. Connect to Amplify in AWS Console and link your GitHub repository"
    step_3 = "3. Run database migrations: npx prisma migrate deploy"
    step_4 = "4. Seed initial data: npm run seed"
    step_5 = "5. If using custom domain, configure DNS records shown above"
    step_6 = "6. Access your site at: ${var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.main.default_domain}"}"
  }
}
