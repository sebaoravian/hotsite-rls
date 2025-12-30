# ==========================================
# AWS Infrastructure for RotomLabs Hotsite
# ==========================================
# Stack: Next.js + PostgreSQL
# Deployment: AWS Amplify + RDS
# Cost: ~$15-25/month (optimized for free tier)
# ==========================================

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment for remote state (recommended for production)
  # backend "s3" {
  #   bucket = "rotom-terraform-state"
  #   key    = "hotsite/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "RLS_RotomLabs_Site"
      Name        = "RLS_${var.project_name}"
      Environment = "RLS_${var.environment}"
      ManagedBy   = "Terraform"
      Owner       = "RotomLabs"
    }
  }
}

# ==========================================
# Data Sources
# ==========================================

data "aws_availability_zones" "available" {
  state = "available"
}

# ==========================================
# VPC and Networking
# ==========================================

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "RLS_${var.project_name}_vpc"
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "RLS_${var.project_name}_private_subnet_${count.index + 1}"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 101}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "RLS_${var.project_name}_public_subnet_${count.index + 1}"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "RLS_${var.project_name}_igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "RLS_${var.project_name}_public_rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ==========================================
# Security Groups
# ==========================================

resource "aws_security_group" "rds" {
  name_prefix = "RLS_${var.project_name}_rds_"
  description = "RLS - Security group for RDS PostgreSQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "PostgreSQL from anywhere (Amplify will connect)"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "RLS_${var.project_name}_rds_sg"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ==========================================
# RDS PostgreSQL Database
# ==========================================

resource "aws_db_subnet_group" "main" {
  name       = "rls-${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "RLS_${var.project_name}_db_subnet_group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier     = "rls-${var.project_name}-db"
  engine         = "postgres"
  engine_version = "15.15"
  
  # Instance specs (t3.micro es elegible para free tier)
  instance_class        = var.db_instance_class
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  # Database configuration
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = 5432

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = true  # Necesario para Amplify

  # Backups
  backup_retention_period = var.environment == "production" ? 7 : 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  # Snapshots
  skip_final_snapshot       = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "rls-${var.project_name}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null
  
  # Performance
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  monitoring_interval             = 0  # 0 = disabled (para ahorrar)
  
  # High availability (solo para producción)
  multi_az = var.environment == "production" ? false : false  # Cambiar a true si necesitas HA

  tags = {
    Name = "RLS_${var.project_name}_postgres_db"
  }

  lifecycle {
    ignore_changes = [
      password  # Para evitar recreación si se cambia el password manualmente
    ]
  }
}

# ==========================================
# Secrets Manager (para guardar credenciales)
# ==========================================

resource "aws_secretsmanager_secret" "db_credentials" {
  name_prefix = "RLS_${var.project_name}_db_credentials_"
  description = "RLS - Database credentials for ${var.project_name}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username            = var.db_username
    password            = var.db_password
    engine              = "postgres"
    host                = aws_db_instance.postgres.endpoint
    port                = 5432
    dbname              = var.db_name
    dbInstanceIdentifier = aws_db_instance.postgres.identifier
    DATABASE_URL        = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.endpoint}/${var.db_name}"
  })
}

# ==========================================
# AWS Amplify App
# ==========================================

resource "aws_amplify_app" "main" {
  name       = var.project_name
  # repository se conectará manualmente después del apply

  # Build settings para Next.js
  build_spec = <<-EOT
    version: 1
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: .next
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
              - .next/cache/**/*
        appRoot: .
  EOT

  # Variables de entorno
  environment_variables = {
    NODE_VERSION      = "18"
    NEXT_PUBLIC_URL   = "https://${var.domain_name}"
    DATABASE_URL      = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.endpoint}/${var.db_name}"
    SITE_PASSWORD     = var.site_password
    SESSION_SECRET    = var.session_secret
  }

  # Custom rules para Next.js
  # Nota: HTTPS es manejado automáticamente por Amplify cuando se configura custom domain
  
  # 1. Redirección de dominio sin www a www
  dynamic "custom_rule" {
    for_each = var.redirect_to_www ? [1] : []
    content {
      source = "https://${replace(var.domain_name, "www.", "")}/<*>"
      status = "301"
      target = "https://${var.domain_name}/<*>"
    }
  }

  # 2. Manejo de rutas de Next.js (SPA fallback)
  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }

  # Auto branch creation (deshabilitado por seguridad)
  enable_auto_branch_creation = false
  enable_branch_auto_build    = true
  enable_branch_auto_deletion = false

  tags = {
    Name = "RLS_${var.project_name}_amplify_app"
  }
}

# Branch principal
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.main.id
  branch_name = var.git_branch
  
  enable_auto_build = true
  stage             = var.environment == "production" ? "PRODUCTION" : "DEVELOPMENT"

  environment_variables = {
    ENV = var.environment
  }
}

# ==========================================
# Custom Domain & SSL
# ==========================================

resource "aws_amplify_domain_association" "main" {
  count       = var.domain_name != "" ? 1 : 0
  app_id      = aws_amplify_app.main.id
  domain_name = var.domain_name

  # Configuración para www.rotom-labs.com (principal)
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""  # www.rotom-labs.com
  }

  # Configuración para rotom-labs.com (redirige a www)
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""  # Root sin prefijo (apex domain)
  }

  # SSL certificate is automatically provided by Amplify
  # using AWS Certificate Manager (ACM)
  # - Soporta HTTP/2
  # - TLS 1.2+
  # - Renovación automática
  
  wait_for_verification = true
}

# ==========================================
# CloudWatch Alarms (opcional, para monitoreo)
# ==========================================

resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  count               = var.enable_monitoring ? 1 : 0
  alarm_name          = "RLS_${var.project_name}_rds_cpu_utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS CPU utilization"
  alarm_actions       = []  # Agregar SNS topic si quieres notificaciones

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.id
  }
}

resource "aws_cloudwatch_metric_alarm" "database_storage" {
  count               = var.enable_monitoring ? 1 : 0
  alarm_name          = "RLS_${var.project_name}_rds_free_storage"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "2000000000"  # 2GB en bytes
  alarm_description   = "This metric monitors RDS free storage space"
  alarm_actions       = []

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.id
  }
}
