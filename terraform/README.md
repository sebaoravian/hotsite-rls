# 🚀 AWS Deployment con Terraform

Infraestructura como código para desplegar RotomLabs Hotsite en AWS.

## 📁 Estructura

```
terraform/
├── main.tf                     # Configuración principal de infraestructura
├── variables.tf                # Variables de configuración
├── outputs.tf                  # Outputs después del despliegue
├── terraform.tfvars.example    # Ejemplo de configuración
├── .gitignore                  # Archivos a ignorar
├── DEPLOYMENT.md              # Guía completa de despliegue
└── scripts/
    ├── pre-deploy-check.sh    # Verificación pre-despliegue
    └── post-deploy-check.sh   # Verificación post-despliegue
```

## 🏗️ Arquitectura

- **Frontend/Backend**: AWS Amplify (Next.js)
- **Base de Datos**: RDS PostgreSQL (db.t3.micro)
- **SSL**: AWS Certificate Manager (gratis)
- **Networking**: VPC, subnets, security groups
- **Secrets**: AWS Secrets Manager

## 💰 Costo Estimado

**$20-35/mes** (con tráfico bajo)
- Con Free Tier primer año: **$5-10/mes**

## 🚀 Quick Start

### 1. Instalar herramientas

```bash
# macOS
brew install terraform awscli
```

### 2. Configurar AWS

```bash
aws configure
```

### 3. Configurar variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Editar con tus valores
```

### 4. Verificar configuración

```bash
./scripts/pre-deploy-check.sh
```

### 5. Desplegar

```bash
terraform init
terraform plan
terraform apply
```

### 6. Verificar despliegue

```bash
./scripts/post-deploy-check.sh
```

## 📖 Documentación Completa

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para:
- Guía paso a paso detallada
- Configuración post-despliegue
- Troubleshooting
- Mantenimiento
- Seguridad
- Monitoreo

## ⚠️ Importante

1. **Nunca commitear** `terraform.tfvars` (contiene credenciales)
2. **Cambiar contraseñas** antes de producción
3. **Habilitar backups** en producción
4. **Configurar alertas** para monitoreo

## 🔒 Seguridad

- SSL automático con Certificate Manager
- Credenciales en Secrets Manager
- Security groups restrictivos
- Backups automáticos de RDS
- Encriptación en reposo

## 📊 Recursos Creados

- 1x VPC
- 4x Subnets (2 públicas, 2 privadas)
- 1x Internet Gateway
- 2x Route Tables
- 2x Security Groups
- 1x RDS PostgreSQL
- 1x Amplify App
- 1x Secret (Secrets Manager)
- SSL Certificate (automático)

## 🛠️ Comandos Útiles

```bash
# Ver outputs
terraform output

# Conectar a DB
psql $(terraform output -raw database_url)

# Redesplegar app
aws amplify start-job \
  --app-id $(terraform output -raw amplify_app_id) \
  --branch-name main \
  --job-type RELEASE

# Ver logs
terraform output quick_commands
```

## 🗑️ Destruir Infraestructura

```bash
terraform destroy
```

⚠️ **PELIGRO**: Eliminará todos los recursos y datos.

## 📚 Recursos

- [Guía de Despliegue Completa](./DEPLOYMENT.md)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Amplify](https://docs.aws.amazon.com/amplify/)
- [RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)

---

**¿Preguntas?** Ver [DEPLOYMENT.md](./DEPLOYMENT.md) o revisar troubleshooting section.
