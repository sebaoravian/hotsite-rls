#!/bin/bash

# ==========================================
# Script de Verificación Post-Despliegue
# ==========================================
# Verifica que todos los componentes se desplegaron correctamente
# Uso: ./scripts/post-deploy-check.sh
# ==========================================

set -e

echo "🔍 Verificando despliegue..."
echo ""

cd "$(dirname "$0")/.."

# ==========================================
# Verificar que terraform apply se ejecutó
# ==========================================

echo "1️⃣ Verificando estado de Terraform..."

if [ ! -f "terraform.tfstate" ]; then
    echo "❌ terraform.tfstate no encontrado"
    echo "   ¿Ejecutaste 'terraform apply'?"
    exit 1
fi
echo "✅ Terraform state encontrado"
echo ""

# ==========================================
# Obtener outputs
# ==========================================

echo "2️⃣ Obteniendo información del despliegue..."

DATABASE_ENDPOINT=$(terraform output -raw database_endpoint 2>/dev/null || echo "")
AMPLIFY_APP_ID=$(terraform output -raw amplify_app_id 2>/dev/null || echo "")
AMPLIFY_URL=$(terraform output -raw amplify_app_url 2>/dev/null || echo "")

if [ -z "$DATABASE_ENDPOINT" ] || [ -z "$AMPLIFY_APP_ID" ]; then
    echo "❌ No se pudieron obtener outputs"
    echo "   Ejecutar: terraform refresh"
    exit 1
fi

echo "✅ Database: $DATABASE_ENDPOINT"
echo "✅ Amplify App ID: $AMPLIFY_APP_ID"
echo "✅ App URL: $AMPLIFY_URL"
echo ""

# ==========================================
# Verificar RDS
# ==========================================

echo "3️⃣ Verificando RDS PostgreSQL..."

DB_STATUS=$(aws rds describe-db-instances \
    --db-instance-identifier $(terraform output -raw database_name)-db \
    --query 'DBInstances[0].DBInstanceStatus' \
    --output text 2>/dev/null || echo "unknown")

if [ "$DB_STATUS" = "available" ]; then
    echo "✅ RDS está disponible"
elif [ "$DB_STATUS" = "creating" ] || [ "$DB_STATUS" = "backing-up" ]; then
    echo "⏳ RDS está en estado: $DB_STATUS (espera 5-10 minutos)"
else
    echo "⚠️  RDS en estado: $DB_STATUS"
fi
echo ""

# ==========================================
# Verificar Amplify
# ==========================================

echo "4️⃣ Verificando AWS Amplify..."

AMPLIFY_STATUS=$(aws amplify get-app \
    --app-id $AMPLIFY_APP_ID \
    --query 'app.defaultDomain' \
    --output text 2>/dev/null || echo "")

if [ -n "$AMPLIFY_STATUS" ]; then
    echo "✅ Amplify app está creada"
    
    # Verificar si hay builds
    JOBS=$(aws amplify list-jobs \
        --app-id $AMPLIFY_APP_ID \
        --branch-name main \
        --max-results 1 \
        --query 'jobSummaries[0].status' \
        --output text 2>/dev/null || echo "NONE")
    
    if [ "$JOBS" = "NONE" ]; then
        echo "⚠️  No hay builds todavía"
        echo "   Conecta GitHub en: https://console.aws.amazon.com/amplify/home#/$AMPLIFY_APP_ID"
    else
        echo "✅ Build status: $JOBS"
    fi
else
    echo "❌ No se pudo verificar Amplify"
fi
echo ""

# ==========================================
# Test de conectividad
# ==========================================

echo "5️⃣ Verificando conectividad..."

# Test database
DB_HOST=$(echo $DATABASE_ENDPOINT | cut -d: -f1)
echo -n "   Database port 5432: "
if nc -zv $DB_HOST 5432 2>&1 | grep -q succeeded; then
    echo "✅ Accesible"
else
    echo "❌ No accesible (puede estar iniciándose)"
fi

# Test Amplify URL
echo -n "   Amplify URL: "
if curl -s -o /dev/null -w "%{http_code}" $AMPLIFY_URL | grep -q "200\|301\|302"; then
    echo "✅ Responde"
else
    echo "⚠️  No responde todavía (normal si aún no desplegaste)"
fi
echo ""

# ==========================================
# Siguiente pasos
# ==========================================

echo "=========================================="
echo "📋 Siguientes pasos necesarios:"
echo "=========================================="
echo ""
echo "1️⃣ Conectar GitHub a Amplify:"
echo "   URL: https://console.aws.amazon.com/amplify/home#/$AMPLIFY_APP_ID"
echo "   • Click en 'Connect branch'"
echo "   • Autoriza GitHub"
echo "   • Selecciona repository y branch 'main'"
echo ""
echo "2️⃣ Ejecutar migraciones de base de datos:"
echo "   export DATABASE_URL=\"$(terraform output -raw database_url)\""
echo "   npx prisma migrate deploy"
echo ""
echo "3️⃣ Seed de datos iniciales (opcional):"
echo "   npm run seed"
echo ""
echo "4️⃣ Verificar aplicación:"
echo "   open $AMPLIFY_URL"
echo ""

if [ -n "$(terraform output -raw domain_name 2>/dev/null)" ]; then
    echo "5️⃣ Configurar DNS para dominio personalizado:"
    echo "   • Ve a Amplify Console → Domain management"
    echo "   • Copia los registros CNAME"
    echo "   • Agrégalos en tu registrador de dominios"
    echo ""
fi

# ==========================================
# Información útil
# ==========================================

echo "=========================================="
echo "📊 Información útil:"
echo "=========================================="
echo ""
echo "• Ver todos los outputs:"
echo "  terraform output"
echo ""
echo "• Conectar a la base de datos:"
echo "  psql $(terraform output -raw database_url)"
echo ""
echo "• Ver logs de Amplify:"
echo "  aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name main"
echo ""
echo "• Redesplegar aplicación:"
echo "  aws amplify start-job --app-id $AMPLIFY_APP_ID --branch-name main --job-type RELEASE"
echo ""

echo "✅ Verificación completa"
