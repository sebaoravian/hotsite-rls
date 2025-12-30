#!/bin/bash

# ==========================================
# Generador de Credenciales Seguras
# ==========================================
# Este script genera contraseñas y secretos seguros
# Uso: ./scripts/generate-secrets.sh
# ==========================================

set -e

echo "🔐 Generador de Credenciales Seguras"
echo "=========================================="
echo ""

# ==========================================
# Verificar dependencias
# ==========================================

if ! command -v openssl &> /dev/null; then
    echo "❌ openssl no está instalado"
    exit 1
fi

# ==========================================
# Generar credenciales
# ==========================================

echo "Generando credenciales seguras..."
echo ""

# Database password (16 caracteres alfanuméricos + símbolos)
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-24)
echo "✅ Database Password generada"

# Site password (16 caracteres alfanuméricos)
SITE_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-16)
echo "✅ Site Password generada"

# Session secret (32 caracteres para mejor seguridad)
SESSION_SECRET=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-32)
echo "✅ Session Secret generada"

echo ""
echo "=========================================="
echo "📋 Credenciales Generadas"
echo "=========================================="
echo ""
echo "⚠️  GUARDA ESTAS CREDENCIALES DE FORMA SEGURA"
echo "⚠️  NO COMMITEES terraform.tfvars A GIT"
echo ""
echo "# Database Configuration"
echo "db_password = \"$DB_PASSWORD\""
echo ""
echo "# Application Secrets"
echo "site_password = \"$SITE_PASSWORD\""
echo "session_secret = \"$SESSION_SECRET\""
echo ""
echo "=========================================="
echo ""

# ==========================================
# Crear/actualizar terraform.tfvars
# ==========================================

read -p "¿Actualizar terraform.tfvars automáticamente? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ ! -f "terraform.tfvars" ]; then
        # Crear desde example
        cp terraform.tfvars.example terraform.tfvars
        echo "✅ Creado terraform.tfvars desde example"
    fi
    
    # Actualizar valores (usando sed para compatibilidad macOS)
    sed -i '' "s/db_password = .*/db_password = \"$DB_PASSWORD\"/" terraform.tfvars
    sed -i '' "s/site_password = .*/site_password = \"$SITE_PASSWORD\"/" terraform.tfvars
    sed -i '' "s/session_secret = .*/session_secret = \"$SESSION_SECRET\"/" terraform.tfvars
    
    echo "✅ terraform.tfvars actualizado"
    echo ""
fi

# ==========================================
# Crear .env para desarrollo local
# ==========================================

read -p "¿Crear/actualizar .env para desarrollo local? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ENV_FILE="../.env"
    
    # Backup si existe
    if [ -f "$ENV_FILE" ]; then
        cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d%H%M%S)"
        echo "✅ Backup creado: ${ENV_FILE}.backup"
    fi
    
    # Crear .env
    cat > "$ENV_FILE" << EOF
# ==========================================
# Environment Variables - Development
# ==========================================
# Generado: $(date)
# NUNCA commitear este archivo a Git
# ==========================================

# Database (usar localhost para desarrollo local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rotomdb?schema=public"

# Authentication
SITE_PASSWORD="$SITE_PASSWORD"
SESSION_SECRET="$SESSION_SECRET"

# App Configuration
NEXT_PUBLIC_URL="http://localhost:3100"
NODE_ENV="development"

# ==========================================
# Para producción, estas variables se configuran
# automáticamente por Terraform en AWS Amplify
# ==========================================
EOF
    
    echo "✅ .env creado en la raíz del proyecto"
    echo ""
fi

echo "=========================================="
echo "✅ Proceso completado"
echo "=========================================="
echo ""
echo "📋 Siguientes pasos:"
echo ""
echo "1. Edita terraform.tfvars y configura:"
echo "   - github_repository"
echo "   - db_name (si es diferente)"
echo "   - db_username (si es diferente)"
echo ""
echo "2. Verifica que las credenciales se guardaron:"
echo "   cat terraform.tfvars"
echo ""
echo "3. Continúa con el despliegue:"
echo "   ./scripts/pre-deploy-check.sh"
echo ""
