#!/bin/bash

# ==========================================
# Script de Verificación Pre-Despliegue
# ==========================================
# Este script verifica que todo esté listo antes de ejecutar terraform apply
# Uso: ./scripts/pre-deploy-check.sh
# ==========================================

set -e  # Exit on error

echo "🔍 Verificando configuración pre-despliegue..."
echo ""

# ==========================================
# Verificar herramientas instaladas
# ==========================================

echo "1️⃣ Verificando herramientas necesarias..."

if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform no está instalado"
    echo "   Instalar: brew install terraform"
    exit 1
fi
echo "✅ Terraform: $(terraform version | head -n 1)"

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado"
    echo "   Instalar: brew install awscli"
    exit 1
fi
echo "✅ AWS CLI: $(aws --version | cut -d' ' -f1)"

if ! command -v jq &> /dev/null; then
    echo "⚠️  jq no está instalado (opcional pero recomendado)"
    echo "   Instalar: brew install jq"
fi

echo ""

# ==========================================
# Verificar AWS credentials
# ==========================================

echo "2️⃣ Verificando credenciales AWS..."

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Credenciales AWS no configuradas o inválidas"
    echo "   Ejecutar: aws configure"
    exit 1
fi

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
AWS_USER=$(aws sts get-caller-identity --query Arn --output text)
echo "✅ AWS Account: $AWS_ACCOUNT"
echo "✅ AWS User: $AWS_USER"
echo ""

# ==========================================
# Verificar terraform.tfvars
# ==========================================

echo "3️⃣ Verificando archivo terraform.tfvars..."

if [ ! -f "terraform.tfvars" ]; then
    echo "❌ Archivo terraform.tfvars no encontrado"
    echo "   Copiar: cp terraform.tfvars.example terraform.tfvars"
    echo "   Luego editar con tus valores"
    exit 1
fi
echo "✅ terraform.tfvars existe"

# Verificar valores críticos
echo ""
echo "🔍 Verificando valores en terraform.tfvars..."

check_var() {
    local var_name=$1
    local var_value=$(grep "^$var_name" terraform.tfvars | cut -d'=' -f2 | tr -d ' "' || echo "")
    
    if [ -z "$var_value" ] || [ "$var_value" = "CHANGE_THIS" ] || [[ "$var_value" == *"YOUR_"* ]]; then
        echo "⚠️  $var_name: necesita configuración"
        return 1
    else
        echo "✅ $var_name: configurado"
        return 0
    fi
}

WARNINGS=0

# Variables críticas
if ! check_var "github_repository"; then ((WARNINGS++)); fi
if ! check_var "db_password"; then ((WARNINGS++)); fi
if ! check_var "site_password"; then ((WARNINGS++)); fi
if ! check_var "session_secret"; then ((WARNINGS++)); fi

echo ""

if [ $WARNINGS -gt 0 ]; then
    echo "⚠️  Hay $WARNINGS variable(s) que necesitan configuración"
    echo "   Editar: nano terraform.tfvars"
    echo ""
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# ==========================================
# Verificar estructura del proyecto
# ==========================================

echo "4️⃣ Verificando estructura del proyecto..."

REQUIRED_FILES=(
    "../package.json"
    "../next.config.js"
    "../prisma/schema.prisma"
    "../src/app/layout.tsx"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Archivo requerido no encontrado: $file"
        exit 1
    fi
done
echo "✅ Estructura del proyecto correcta"
echo ""

# ==========================================
# Verificar región AWS
# ==========================================

echo "5️⃣ Verificando región AWS..."

AWS_REGION=$(grep "^aws_region" terraform.tfvars | cut -d'=' -f2 | tr -d ' "' || echo "us-east-1")
echo "✅ Región configurada: $AWS_REGION"
echo ""

# ==========================================
# Estimación de costos
# ==========================================

echo "💰 Estimación de costos mensuales (USD):"
echo "   • RDS PostgreSQL (db.t3.micro): $15-20"
echo "   • AWS Amplify: $5-15"
echo "   • Secrets Manager: $0.40"
echo "   • Data Transfer: $1-5"
echo "   • Total: $20-35/mes"
echo "   • Con Free Tier (primer año): $5-10/mes"
echo ""

# ==========================================
# Resumen y siguientes pasos
# ==========================================

echo "=========================================="
echo "✅ Todas las verificaciones pasaron"
echo "=========================================="
echo ""
echo "📋 Siguientes pasos:"
echo "1. terraform init    (inicializar providers)"
echo "2. terraform plan    (revisar cambios)"
echo "3. terraform apply   (aplicar infraestructura)"
echo ""
echo "⏱️  Tiempo estimado de despliegue: 10-15 minutos"
echo ""
echo "💡 Tip: Guarda los outputs después de aplicar:"
echo "   terraform output > deployment-info.txt"
echo ""

read -p "¿Ejecutar 'terraform init' ahora? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    terraform init
fi
