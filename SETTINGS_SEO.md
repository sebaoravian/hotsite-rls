# 🎯 Configuración SEO del Sitio

## Acceso Rápido
**URL**: `http://localhost:3100/admin/settings`

## 🆕 Nueva Funcionalidad

Ahora puedes configurar **todos los aspectos SEO del sitio** desde el panel de administración, sin necesidad de tocar código o reiniciar el servidor (excepto para cambios de seguridad).

## 📋 Secciones de Configuración

### 1️⃣ SEO General
**¿Qué se configura?**
- Nombre del sitio (aparece en tabs del navegador)
- Título SEO principal (máx 60 caracteres)
- Descripción del sitio (máx 160 caracteres)
- Keywords principales
- Imagen Open Graph por defecto
- URL canónica del sitio
- Locale e idioma

**¿Dónde se aplica?**
- Meta tags en todas las páginas
- Open Graph tags (Facebook, LinkedIn)
- Twitter Cards
- Structured Data (JSON-LD)
- Títulos de pestañas del navegador

**Contadores de caracteres:**
- ✅ Verde: dentro del límite
- 🔴 Rojo: excede el límite recomendado

### 2️⃣ Google Services
**¿Qué se configura?**
- Google Analytics 4 ID (formato: G-XXXXXXXXXX)
- Google Site Verification (para Search Console)
- Google Tag Manager ID (formato: GTM-XXXXXXX)

**¿Dónde se aplica?**
- Scripts de Analytics se inyectan automáticamente
- Meta tag de verificación en `<head>`
- GTM se carga en todas las páginas

**No necesitas:**
- ❌ Editar código HTML
- ❌ Agregar scripts manualmente
- ❌ Crear variables de entorno

### 3️⃣ Redes Sociales
**¿Qué se configura?**
- Twitter handle (con @)
- Facebook App ID (opcional)
- LinkedIn URL de la empresa
- Instagram URL del perfil

**¿Dónde se aplica?**
- Twitter Cards (creator attribution)
- Structured Data de Organization
- Links en footer y schemas

### 4️⃣ Seguridad
**¿Qué se configura?**
- Contraseña del sitio principal
- Session Secret para autenticación

**⚠️ Importante:**
- Estos cambios requieren **reiniciar el servidor**
- Se guardan en archivo `.env`
- No tocar en producción sin planificación

## 🔄 Flujo de Trabajo

### Primera Vez
1. Ve a `/admin/settings`
2. Completa todos los campos de **SEO General**
3. Ingresa tu **Google Analytics ID**
4. Configura **URLs de redes sociales**
5. Click en **Guardar Configuración**
6. ✅ Cambios aplicados inmediatamente

### Actualizar SEO
1. Modifica los campos necesarios
2. Usa los contadores para verificar límites
3. Click en **Guardar Configuración**
4. ✅ Se aplica en tiempo real (sin reinicio)

### Actualizar Seguridad
1. Modifica contraseña o session secret
2. Click en **Guardar Configuración**
3. ⚠️ **REINICIAR el servidor** para aplicar
4. ✅ Cambios activos después del reinicio

## 📊 Integración con el Sistema

### Base de Datos
Los settings SEO se guardan en la tabla `SiteSettings`:
```sql
SELECT * FROM SiteSettings;
```

### API
- **GET** `/api/settings` - Obtiene configuración actual
- **POST** `/api/settings` - Guarda nueva configuración

### Layout
El `layout.tsx` consume automáticamente:
- `generateMetadata()` - Genera meta tags dinámicos
- `getSettings()` - Carga settings en tiempo de construcción
- Scripts de Analytics/GTM se inyectan condicionalmente

### Structured Data
Los schemas `OrganizationSchema` y `WebsiteSchema` son ahora componentes **async** que leen de la base de datos.

## ✅ Verificación

### Después de Configurar:
1. **Ver código fuente** (Ctrl+U o Cmd+U)
   - Busca `<meta property="og:title"`
   - Busca `<meta name="description"`
   - Verifica que tengan tus valores

2. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Pega tu URL y verifica preview

3. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Verifica que aparezca tu imagen y descripción

4. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Verifica que los schemas sean válidos

5. **Lighthouse**
   - DevTools > Lighthouse > Run
   - SEO score debe ser 90+

## 🚨 Troubleshooting

### "Los cambios no se aplican"
- ✅ Verifica que guardaste la configuración
- ✅ Recarga la página con Cmd+Shift+R (hard reload)
- ✅ Limpia caché del navegador

### "Google Analytics no trackea"
- ✅ Verifica formato del ID: `G-XXXXXXXXXX`
- ✅ Abre DevTools > Network > filtra "gtag"
- ✅ Debe aparecer request a Google Analytics

### "Site Verification no funciona"
- ✅ Copia solo el código, no la etiqueta completa
- ✅ Ejemplo correcto: `abc123xyz`
- ✅ Ejemplo incorrecto: `<meta name="google-site-verification" content="abc123xyz">`

### "Imagen OG no aparece en Facebook"
- ✅ Debe ser URL absoluta: `https://rotom-labs.com/og-image.png`
- ✅ Tamaño: 1200x630 píxeles exactos
- ✅ Usa Facebook Debugger para forzar re-scrape

## 📚 Recursos Adicionales

- **SEO Guide Completa**: Ver `SEO_GUIDE.md`
- **Mejores Prácticas**: Sección en `SEO_GUIDE.md`
- **Checklist de Producción**: Ver `SEO_GUIDE.md`

## 🎨 Campos Recomendados

### Para Desarrollo/Testing:
```
Site Name: RotomLabs
Site Title: RotomLabs — Digital Backbone
Site Description: RotomLabs builds the digital backbone behind global companies...
Keywords: cloud architecture, data engineering, AI development
OG Image: /logo.png
Canonical URL: http://localhost:3100
Locale: en_US
Language: en
```

### Para Producción:
```
Site Name: RotomLabs
Site Title: RotomLabs — Digital Backbone for Global Companies
Site Description: RotomLabs builds secure, scalable digital infrastructure...
Keywords: cloud architecture, enterprise software, AI solutions
OG Image: https://rotom-labs.com/images/og-default.png
Canonical URL: https://rotom-labs.com
Twitter Handle: @rotom_labs
Google Analytics: G-ABC123XYZ
Google Site Verification: tu-codigo-aqui
```

## 🔐 Seguridad

### ¿Qué NO hacer?
- ❌ No compartas el Session Secret públicamente
- ❌ No uses "admin123" en producción
- ❌ No expongas las claves de API en el código

### ¿Qué SÍ hacer?
- ✅ Cambia la contraseña antes de deploy
- ✅ Genera Session Secret fuerte (32+ caracteres random)
- ✅ Usa variables de entorno en producción para secretos
- ✅ Mantén backups de la base de datos

## 🎯 Próximos Pasos

1. **Configurar campos básicos** en `/admin/settings`
2. **Probar localmente** con las herramientas de verificación
3. **Crear imagen OG personalizada** (1200x630px)
4. **Verificar en Google Search Console**
5. **Monitorear Analytics** después de deploy

---

**¿Dudas?** Consulta `SEO_GUIDE.md` para la guía completa.
