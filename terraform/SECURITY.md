# 🔐 Guía de Seguridad - AWS Deployment

## 📋 Checklist de Seguridad

### Pre-Despliegue

#### 1. Credenciales Seguras

```bash
# Generar credenciales automáticamente
cd terraform
./scripts/generate-secrets.sh
```

El script genera:
- ✅ **Database Password**: 24 caracteres (alfanuméricos + símbolos)
- ✅ **Site Password**: 16 caracteres (alfanuméricos)
- ✅ **Session Secret**: 32 caracteres (para JWT)

#### 2. Configurar terraform.tfvars

```bash
# Copiar template
cp terraform.tfvars.example terraform.tfvars

# Editar con valores seguros
nano terraform.tfvars
```

**Valores obligatorios:**

```hcl
# Repositorio de GitHub
github_repository = "https://github.com/YOUR_ORG/hotsite"

# Dominio con HTTPS
domain_name = "www.rotom-labs.com"

# Credenciales (usar valores generados por generate-secrets.sh)
db_password    = "GENERADO_POR_SCRIPT"
site_password  = "GENERADO_POR_SCRIPT"
session_secret = "GENERADO_POR_SCRIPT"
```

#### 3. Verificar .gitignore

```bash
# Verificar que estos archivos NO se commiteen
cat .gitignore | grep -E "\.env$|\.tfvars$|\.tfstate"
```

Debe incluir:
```
# Environment
.env
.env.local
.env.production

# Terraform
terraform.tfvars
*.tfstate
*.tfstate.backup
.terraform/
```

---

## 🌐 Configuración de Dominio y HTTPS

### Características Implementadas

✅ **Redirección HTTP → HTTPS**: Automática (301)  
✅ **Redirección www**: `rotom-labs.com` → `www.rotom-labs.com`  
✅ **SSL/TLS**: Certificado gratuito con AWS ACM  
✅ **HTTP/2**: Habilitado por defecto  
✅ **TLS 1.2+**: Protocolos antiguos deshabilitados  

### Flujo de Redirección

```
http://rotom-labs.com/about
    ↓ (301)
https://www.rotom-labs.com/about
    ↓ (200)
Your App ✅
```

### Configuración en Terraform

El dominio `www.rotom-labs.com` está configurado en:

**[terraform.tfvars](terraform.tfvars.example)**:
```hcl
domain_name = "www.rotom-labs.com"
redirect_to_www = true
```

**[main.tf](main.tf)** incluye:
1. Custom rule para forzar HTTPS
2. Redirección de apex domain (rotom-labs.com) a www
3. Configuración automática de SSL con ACM

---

## 🔒 Seguridad de Base de Datos

### Configuración RDS

```hcl
# En main.tf
resource "aws_db_instance" "postgres" {
  # Seguridad
  storage_encrypted     = true              # ✅ Encriptación en reposo
  publicly_accessible   = true              # Necesario para Amplify
  
  # Backups automáticos
  backup_retention_period = 7               # 7 días en producción
  backup_window          = "03:00-04:00"   # 3-4 AM
  
  # Contraseña
  password = var.db_password                # Desde terraform.tfvars
}
```

### Security Groups

- **Puerto 5432**: Abierto solo para PostgreSQL
- **HTTPS (443)**: Manejado por Amplify
- **HTTP (80)**: Redirige automáticamente a HTTPS

### Gestión de Secretos

Las credenciales se almacenan en **AWS Secrets Manager**:

```bash
# Ver secreto
aws secretsmanager get-secret-value \
  --secret-id $(terraform output -raw database_secret_arn)

# Rotar contraseña
./terraform/scripts/rotate-db-password.sh
```

---

## 🛡️ Mejores Prácticas

### 1. Contraseñas

✅ **Hacer:**
- Usar generador: `./scripts/generate-secrets.sh`
- Mínimo 16 caracteres para passwords
- Mínimo 32 caracteres para secrets
- Incluir mayúsculas, minúsculas, números, símbolos

❌ **NO hacer:**
- `password123`, `admin`, `rotom2025`
- Reutilizar contraseñas
- Compartir por email/Slack
- Commitear a Git

### 2. Variables de Entorno

✅ **Producción (AWS Amplify):**
```hcl
# En main.tf - Configurado por Terraform
environment_variables = {
  DATABASE_URL   = "postgresql://..."
  SESSION_SECRET = var.session_secret
  SITE_PASSWORD  = var.site_password
}
```

✅ **Desarrollo Local:**
```bash
# .env (no commitear)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rotomdb"
SESSION_SECRET="dev-secret-not-for-production"
SITE_PASSWORD="dev123"
```

### 3. GitHub Personal Access Token

Para conectar Amplify con GitHub:

1. Ve a: https://github.com/settings/tokens
2. Generate new token (classic)
3. Scopes necesarios:
   - `repo` (todos)
   - `admin:repo_hook`
4. **Guarda el token de forma segura** (1Password, LastPass, etc.)
5. Solo compartir con Amplify durante setup

### 4. AWS Access Keys

```bash
# Verificar quién eres
aws sts get-caller-identity

# Rotar keys regularmente (cada 90 días)
# En AWS Console > IAM > Users > Security Credentials
```

**Nunca:**
- Commitear `~/.aws/credentials`
- Compartir Access Keys por email
- Usar root account para deployments

---

## 📊 Auditoría y Monitoreo

### CloudTrail (Opcional)

Para auditar todos los cambios en AWS:

```bash
# Habilitar CloudTrail
aws cloudtrail create-trail \
  --name rotom-audit-trail \
  --s3-bucket-name rotom-cloudtrail-logs

# Ver eventos recientes
aws cloudtrail lookup-events --max-results 10
```

### CloudWatch Alarms

Habilitar en `terraform.tfvars`:

```hcl
enable_monitoring = true
```

Esto crea alertas para:
- CPU de RDS > 80%
- Storage de RDS < 2GB
- Errores de Amplify

---

## 🔄 Rotación de Credenciales

### Database Password

```bash
# Método 1: Script automatizado (próximamente)
./terraform/scripts/rotate-db-password.sh

# Método 2: Manual
NEW_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-24)

# Actualizar en RDS
aws rds modify-db-instance \
  --db-instance-identifier rotom-hotsite-db \
  --master-user-password "$NEW_PASS" \
  --apply-immediately

# Actualizar en Secrets Manager
aws secretsmanager update-secret \
  --secret-id rotom-hotsite-db-credentials \
  --secret-string "{\"password\":\"$NEW_PASS\"}"

# Actualizar en Amplify (variable DATABASE_URL)
# AWS Console → Amplify → Environment variables
```

### Session Secret

```bash
# Generar nuevo
NEW_SECRET=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-32)

# Actualizar terraform.tfvars
sed -i '' "s/session_secret = .*/session_secret = \"$NEW_SECRET\"/" terraform.tfvars

# Aplicar
terraform apply

# Esto reiniciará Amplify con el nuevo secret
```

### Site Password (Admin)

```bash
# Cambiar desde el admin panel (próximamente)
# O actualizar terraform.tfvars y aplicar

# Generar nueva
NEW_PASS=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-16)

# Actualizar
sed -i '' "s/site_password = .*/site_password = \"$NEW_PASS\"/" terraform.tfvars

terraform apply
```

**Recomendación**: Rotar cada 90 días.

---

## 🚨 Respuesta a Incidentes

### Compromiso de Credenciales

Si se exponen credenciales:

1. **Inmediato** (< 1 hora):
   ```bash
   # Rotar TODAS las credenciales
   ./terraform/scripts/generate-secrets.sh
   
   # Aplicar inmediatamente
   terraform apply
   ```

2. **Revisar accesos**:
   ```bash
   # Logs de RDS
   aws rds describe-db-log-files \
     --db-instance-identifier rotom-hotsite-db
   
   # Logs de Amplify
   # AWS Console → Amplify → Logs
   ```

3. **Verificar integridad**:
   ```bash
   # Backup de DB
   aws rds create-db-snapshot \
     --db-snapshot-identifier incident-backup-$(date +%Y%m%d)
   
   # Revisar datos sospechosos
   psql $DATABASE_URL -c "SELECT * FROM \"User\" ORDER BY \"createdAt\" DESC LIMIT 10;"
   ```

### Acceso No Autorizado

Si detectas acceso no autorizado:

1. **Cambiar SITE_PASSWORD** inmediatamente
2. **Revisar submissions** en `/admin/contact-submissions`
3. **Revisar logs** de CloudWatch
4. **Considerar rollback** a snapshot anterior

---

## ✅ Checklist Final Pre-Producción

### Credenciales
- [ ] Database password >= 24 caracteres
- [ ] Session secret >= 32 caracteres
- [ ] Site password >= 16 caracteres
- [ ] Ningún valor por defecto (admin123, etc.)
- [ ] terraform.tfvars en .gitignore
- [ ] .env en .gitignore

### Dominio y SSL
- [ ] domain_name = "www.rotom-labs.com"
- [ ] redirect_to_www = true
- [ ] DNS records configurados
- [ ] SSL activo (verificar en navegador)
- [ ] HTTP → HTTPS funciona

### Base de Datos
- [ ] storage_encrypted = true
- [ ] backup_retention_period >= 7
- [ ] Credenciales en Secrets Manager
- [ ] Security group configurado

### Amplify
- [ ] GitHub conectado
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Deployment activo
- [ ] /admin login funciona

### Backups
- [ ] RDS backups automáticos habilitados
- [ ] Snapshot manual inicial creado
- [ ] Plan de recuperación documentado

### Monitoreo (Opcional)
- [ ] CloudWatch alarms configuradas
- [ ] CloudTrail habilitado
- [ ] Notifications configuradas

---

## 📚 Recursos Adicionales

- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#security)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

---

## 🆘 Soporte

Para incidentes de seguridad:
1. Rotar credenciales inmediatamente
2. Revisar logs en CloudWatch
3. Crear backup de emergencia
4. Documentar el incidente

**Contacto de emergencia**: [Añadir contacto del equipo]

---

**Última actualización**: 30 de diciembre de 2025  
**Próxima revisión**: Cada 90 días
