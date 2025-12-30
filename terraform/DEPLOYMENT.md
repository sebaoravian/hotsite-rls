# 🚀 Despliegue AWS con Terraform

## 📋 Índice
- [Requisitos Previos](#requisitos-previos)
- [Arquitectura](#arquitectura)
- [Costos Estimados](#costos-estimados)
- [Configuración Inicial](#configuración-inicial)
- [Despliegue](#despliegue)
- [Configuración Post-Despliegue](#configuración-post-despliegue)
- [Mantenimiento](#mantenimiento)
- [Troubleshooting](#troubleshooting)

---

## 📦 Requisitos Previos

### 1. Instalar Herramientas

```bash
# Terraform (macOS)
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# AWS CLI
brew install awscli

# Verificar instalación
terraform version
aws --version
```

### 2. Configurar AWS CLI

```bash
# Configurar credenciales AWS
aws configure

# Ingresar:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output: json
```

### 3. Crear Personal Access Token en GitHub

1. Ve a GitHub → Settings → Developer Settings → Personal Access Tokens
2. Click en "Generate new token (classic)"
3. Permisos necesarios:
   - `repo` (todos los scopes)
   - `admin:repo_hook` (para webhooks)
4. Guarda el token de forma segura

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTPS (SSL automático)
                   ▼
         ┌─────────────────────┐
         │   AWS Amplify       │
         │   (Next.js App)     │
         │   • Auto-scaling    │
         │   • SSL gratis      │
         │   • CI/CD           │
         └──────────┬──────────┘
                    │
                    │ PostgreSQL
                    ▼
         ┌──────────────────────┐
         │   RDS PostgreSQL     │
         │   • db.t3.micro      │
         │   • 20GB storage     │
         │   • Auto backups     │
         └──────────────────────┘
```

### Componentes

| Componente | Servicio AWS | Propósito | Costo Mensual |
|------------|--------------|-----------|---------------|
| **Frontend/Backend** | AWS Amplify | Hosting Next.js, CI/CD | $5-15 |
| **Base de Datos** | RDS PostgreSQL (t3.micro) | Almacenamiento | $15-20 |
| **Networking** | VPC, Subnets, IGW | Red privada | Gratis |
| **SSL/TLS** | ACM (Certificate Manager) | Certificados SSL | Gratis |
| **Secretos** | Secrets Manager | Credenciales DB | $0.40 |
| **Total Estimado** | | | **$20-35/mes** |

---

## 💰 Costos Estimados

### Desglose Detallado

#### RDS PostgreSQL ($15-20/mes)
- **Instance**: db.t3.micro (750 horas free tier primer año)
- **Storage**: 20GB GP3 ($2.30/mes después del free tier)
- **Backups**: 20GB gratis, luego $0.095/GB-mes
- **Data transfer**: 1GB gratis/mes

#### AWS Amplify ($5-15/mes)
- **Build minutes**: 1000 minutos gratis/mes
- **Hosting**: $0.15/GB almacenado + $0.15/GB transferido
- **Tráfico estimado**: 50GB = ~$7.50
- **CI/CD**: Incluido

#### Optimización de Costos
1. **Free Tier (primer año)**: Reduce RDS a ~$2-5/mes
2. **Instancia ARM (t4g.micro)**: ~20% más barato
3. **Deshabilitar monitoring**: Ahorra ~$2/mes
4. **Storage optimizado**: Usar GP3 en lugar de GP2

### Calculadora de Costos
Para tráfico específico: https://calculator.aws

---

## ⚙️ Configuración Inicial

### 1. Clonar y Navegar

```bash
cd /Users/sebastianmartinez/Documents/Rotomlabs/hotsite/terraform
```

### 2. Crear archivo de variables

```bash
# Copiar ejemplo
cp terraform.tfvars.example terraform.tfvars

# Editar con tus valores
nano terraform.tfvars
```

### 3. Configurar Variables Importantes

Edita `terraform.tfvars`:

```hcl
# ⚠️ CAMBIAR ESTOS VALORES

# GitHub
github_repository = "https://github.com/TU_USUARIO/hotsite"

# Database
db_password = "TuPasswordSegura123!@#"

# Application
site_password  = "AdminPassword123!"
session_secret = "$(openssl rand -base64 32)"  # Ejecutar comando primero

# Domain (opcional)
domain_name = "rotom-labs.com"  # O dejar vacío para usar Amplify domain
```

### 4. Generar Session Secret

```bash
# Generar valor aleatorio seguro
openssl rand -base64 32

# Copiar el resultado a terraform.tfvars
```

---

## 🚀 Despliegue

### Paso 1: Inicializar Terraform

```bash
cd terraform

# Inicializar (descarga providers)
terraform init
```

**Salida esperada:**
```
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.x.x...

Terraform has been successfully initialized!
```

### Paso 2: Validar Configuración

```bash
# Validar sintaxis
terraform validate

# Ver plan de ejecución
terraform plan
```

**Revisar el plan:**
- ✅ Verifica que se crearán ~30-40 recursos
- ✅ Revisa que el dominio sea correcto
- ✅ Confirma la región (us-east-1)

### Paso 3: Aplicar Infraestructura

```bash
# Aplicar cambios
terraform apply

# Terraform preguntará confirmación
# Escribe: yes
```

**⏱️ Tiempo estimado: 10-15 minutos**

### Paso 4: Guardar Outputs

```bash
# Ver outputs importantes
terraform output

# Guardar en archivo para referencia
terraform output > deployment-info.txt
```

---

## 🔧 Configuración Post-Despliegue

### 1. Conectar GitHub a Amplify

#### Opción A: Desde AWS Console (Recomendado)

1. Ve a **AWS Console** → **Amplify**
2. Encuentra tu app: `rotom-hotsite`
3. Click en **"Connect branch"**
4. Autoriza GitHub
5. Selecciona repository y branch `main`
6. Amplify detectará Next.js automáticamente
7. Click en **"Save and Deploy"**

#### Opción B: Desde CLI

```bash
# Obtener App ID
APP_ID=$(terraform output -raw amplify_app_id)

# Conectar con GitHub usando token
aws amplify create-branch \
  --app-id $APP_ID \
  --branch-name main \
  --enable-auto-build
```

### 2. Configurar Base de Datos

```bash
# Obtener DATABASE_URL
terraform output -raw database_url

# Copiar el valor (formato: postgresql://user:pass@host:5432/dbname)
```

#### Ejecutar Migraciones

```bash
# En tu máquina local, configura DATABASE_URL
export DATABASE_URL="postgresql://..."

# Ejecutar migraciones
npx prisma migrate deploy

# Seed inicial (opcional)
npm run seed
```

### 3. Configurar Dominio Personalizado (Opcional)

Si configuraste `domain_name` en terraform.tfvars:

1. Ve a **Amplify Console** → Tu App → **Domain management**
2. Verás los registros DNS necesarios (CNAME)
3. Ve a tu **registrador de dominios** (GoDaddy, Namecheap, etc.)
4. Agrega los registros DNS:

```
Tipo: CNAME
Nombre: @
Valor: xxx.cloudfront.net (del paso 2)

Tipo: CNAME
Nombre: www
Valor: xxx.cloudfront.net
```

5. Espera propagación DNS (15-60 minutos)
6. SSL se configurará automáticamente (5-10 minutos adicionales)

### 4. Verificar Deployment

```bash
# Obtener URL de la app
terraform output amplify_app_url

# Abrir en navegador
open $(terraform output -raw amplify_app_url)
```

---

## 🔄 Mantenimiento

### Ver Logs de Amplify

```bash
# AWS Console
AWS Console → Amplify → Tu App → Logs

# O desde CLI
aws amplify list-jobs --app-id $(terraform output -raw amplify_app_id) --branch-name main
```

### Conectar a la Base de Datos

```bash
# Obtener endpoint
DB_HOST=$(terraform output -raw database_endpoint | cut -d: -f1)

# Conectar con psql
psql -h $DB_HOST -U rotomadmin -d rotomdb

# O usar cliente GUI:
# - TablePlus
# - DBeaver
# - pgAdmin
```

### Actualizar Variables de Entorno

```bash
# Editar terraform.tfvars
nano terraform.tfvars

# Aplicar cambios
terraform apply

# Amplify redesplegará automáticamente
```

### Backups de Base de Datos

```bash
# Ver snapshots automáticos
aws rds describe-db-snapshots \
  --db-instance-identifier rotom-hotsite-db

# Crear snapshot manual
aws rds create-db-snapshot \
  --db-snapshot-identifier rotom-manual-backup-$(date +%Y%m%d) \
  --db-instance-identifier rotom-hotsite-db
```

### Restaurar desde Backup

```bash
# Listar snapshots
aws rds describe-db-snapshots --db-instance-identifier rotom-hotsite-db

# Restaurar (crea nueva instancia)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier rotom-hotsite-db-restored \
  --db-snapshot-identifier <snapshot-id>
```

---

## 🛠️ Troubleshooting

### Problema: Terraform apply falla

```bash
# Error común: credenciales AWS
aws sts get-caller-identity

# Si falla, reconfigura
aws configure
```

### Problema: Amplify no conecta con GitHub

**Solución:**
1. Ve a AWS Console → Amplify
2. Click en tu app → App settings → General
3. Reconnect repository
4. Autoriza GitHub nuevamente

### Problema: Base de datos no es accesible

```bash
# Verificar security group
aws ec2 describe-security-groups \
  --group-ids $(terraform output -raw rds_security_group_id)

# Verificar que puerto 5432 esté abierto desde 0.0.0.0/0
```

### Problema: SSL no se activa en dominio

**Causas comunes:**
1. Registros DNS no propagados (espera 1 hora)
2. Registros DNS incorrectos
3. Dominio no verificado

**Solución:**
```bash
# Verificar DNS
dig rotom-labs.com
dig www.rotom-labs.com

# Verificar certificado en Amplify Console
AWS Console → Amplify → Domain management → Certificate status
```

### Problema: Build falla en Amplify

**Ver logs:**
1. AWS Console → Amplify → Tu App
2. Click en el build fallido
3. Revisar logs de cada fase (Provision, Build, Deploy)

**Errores comunes:**
```bash
# Node version incorrecta
# Solución: Verificar environment_variables en main.tf
NODE_VERSION = "18"

# Dependencias faltantes
# Solución: Verificar package.json y lockfile

# Variables de entorno faltantes
# Solución: Agregar en Amplify Console → Environment variables
```

---

## 🔐 Seguridad

### Checklist Pre-Producción

- [ ] Cambiar `db_password` por valor fuerte (16+ caracteres)
- [ ] Generar nuevo `session_secret` (32+ caracteres)
- [ ] Actualizar `site_password` del admin
- [ ] Habilitar backups automáticos (ya configurado)
- [ ] Configurar alertas de CloudWatch (opcional)
- [ ] Revisar security groups
- [ ] Habilitar MFA en cuenta AWS
- [ ] Configurar AWS CloudTrail (auditoría)

### Rotar Credenciales

```bash
# 1. Generar nueva contraseña
NEW_PASS=$(openssl rand -base64 32)

# 2. Actualizar en RDS
aws rds modify-db-instance \
  --db-instance-identifier rotom-hotsite-db \
  --master-user-password "$NEW_PASS" \
  --apply-immediately

# 3. Actualizar en Secrets Manager
aws secretsmanager update-secret \
  --secret-id $(terraform output -raw database_secret_arn) \
  --secret-string "$(jq -n --arg pass "$NEW_PASS" '{password: $pass}')"

# 4. Actualizar DATABASE_URL en Amplify
# AWS Console → Amplify → Environment variables
```

---

## 📊 Monitoreo

### Métricas Importantes

#### RDS
```bash
# CPU Utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=rotom-hotsite-db \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

#### Amplify
- Builds: AWS Console → Amplify → Build history
- Traffic: CloudWatch → Amplify metrics
- Errors: CloudWatch Logs

### Alertas (Opcional)

Para habilitar alertas, configura en `terraform.tfvars`:
```hcl
enable_monitoring = true
```

---

## 🗑️ Destruir Infraestructura

**⚠️ PELIGRO: Esto eliminará TODOS los recursos y datos**

```bash
# Ver qué se destruirá
terraform plan -destroy

# Confirmar y destruir
terraform destroy

# Terraform preguntará confirmación
# Escribe: yes
```

**Nota:** Snapshots finales de la DB se crearán automáticamente (solo en producción).

---

## 📚 Recursos Adicionales

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [AWS Free Tier](https://aws.amazon.com/free/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 💡 Tips y Mejores Prácticas

### 1. Desarrollo Local

Usa Docker para desarrollo local que replica RDS:

```bash
docker run -d \
  --name postgres-local \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=rotomdb \
  -p 5432:5432 \
  postgres:15
```

### 2. CI/CD Automático

Amplify se conecta con GitHub y despliega automáticamente en cada push a `main`.

### 3. Múltiples Ambientes

Para crear ambientes staging/dev:

```bash
# Crear workspace
terraform workspace new staging

# Seleccionar
terraform workspace select staging

# Aplicar con diferentes variables
terraform apply -var-file=staging.tfvars
```

### 4. State Remoto (Recomendado para Equipos)

Descomentar en `main.tf`:

```hcl
backend "s3" {
  bucket = "rotom-terraform-state"
  key    = "hotsite/terraform.tfstate"
  region = "us-east-1"
}
```

Crear bucket S3 primero:
```bash
aws s3 mb s3://rotom-terraform-state
aws s3api put-bucket-versioning \
  --bucket rotom-terraform-state \
  --versioning-configuration Status=Enabled
```

---

## ✅ Checklist de Despliegue

### Pre-Despliegue
- [ ] AWS CLI configurado
- [ ] Terraform instalado
- [ ] GitHub Personal Access Token creado
- [ ] terraform.tfvars configurado
- [ ] Contraseñas seguras generadas

### Despliegue
- [ ] `terraform init` exitoso
- [ ] `terraform plan` revisado
- [ ] `terraform apply` completado
- [ ] Outputs guardados

### Post-Despliegue
- [ ] Amplify conectado con GitHub
- [ ] Primera build completada
- [ ] Migraciones ejecutadas
- [ ] Seed de datos (opcional)
- [ ] Dominio personalizado configurado (opcional)
- [ ] SSL activo
- [ ] Aplicación accesible

### Verificación
- [ ] Login admin funciona
- [ ] Base de datos responde
- [ ] Forms envían datos
- [ ] Imágenes cargan
- [ ] SEO meta tags correctos
- [ ] Analytics funcionando

---

**🎉 ¡Listo! Tu aplicación está en producción en AWS con SSL automático.**

**Costo estimado: $20-35/mes** (puede ser $0-5/mes el primer año con free tier)

Para soporte: consulta los logs y troubleshooting sections o abre un issue.
