# ==========================================
# AWS Infrastructure Variables
# ==========================================

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"  # N. Virginia (tiene los precios más bajos)
}

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name (used for resource naming)"
  type        = string
  default     = "rls"
}

# ==========================================
# Database Configuration
# ==========================================

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "rotomdb"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "rotomadmin"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.db_password) >= 8
    error_message = "Database password must be at least 8 characters long."
  }
}

variable "db_instance_class" {
  description = "RDS instance type"
  type        = string
  default     = "db.t3.micro"  # Free tier eligible, bueno para desarrollo
  # Para producción considerar: "db.t4g.small" (más económico con ARM)
}

variable "db_allocated_storage" {
  description = "Initial storage allocation in GB"
  type        = number
  default     = 20  # Free tier: hasta 20GB
}

variable "db_max_allocated_storage" {
  description = "Maximum storage allocation for autoscaling in GB"
  type        = number
  default     = 50  # Autoscaling hasta 50GB
}

# ==========================================
# Application Configuration
# ==========================================

variable "github_repository" {
  description = "GitHub repository URL (https://github.com/owner/repo)"
  type        = string
  # Ejemplo: "https://github.com/rotomlabs/hotsite"
}

variable "git_branch" {
  description = "Git branch to deploy"
  type        = string
  default     = "main"
}

variable "domain_name" {
  description = "Custom domain name (leave empty to use Amplify default)"
  type        = string
  default     = ""
  # Ejemplo: "www.rotom-labs.com"
}

variable "redirect_to_www" {
  description = "Redirect non-www to www domain"
  type        = bool
  default     = true
}

variable "site_password" {
  description = "Site password for admin access"
  type        = string
  sensitive   = true
  default     = ""  # Cambiar por una contraseña segura
}

variable "session_secret" {
  description = "Session secret for authentication"
  type        = string
  sensitive   = true
  default     = ""  # Cambiar por un valor aleatorio de 32+ caracteres
}

# ==========================================
# Monitoring & Cost Control
# ==========================================

variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring and alarms"
  type        = bool
  default     = false  # false para ahorrar costos en dev
}

# ==========================================
# Tags
# ==========================================

variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
