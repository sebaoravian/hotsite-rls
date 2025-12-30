# Sistema de Analytics y Campañas

Este proyecto incluye un sistema completo de Google Analytics 4 y gestión de campañas con tracking UTM.

## Configuración de Google Analytics

### 1. Obtener tu ID de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una propiedad GA4 si no tienes una
3. Copia el ID de medición (formato: `G-XXXXXXXXXX`)

### 2. Configurar el ID en el proyecto

Edita el archivo `.env` y descomenta/agrega:

```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

Reemplaza `G-XXXXXXXXXX` con tu ID real de Google Analytics.

### 3. Verificar la instalación

Una vez configurado el ID:
- El script de GA4 se cargará automáticamente
- Los pageviews se trackearán automáticamente
- Los eventos personalizados se registrarán en GA4

## Eventos que se trackean automáticamente

### 1. **Pageviews**
Se trackean automáticamente cuando el usuario navega entre páginas.

### 2. **Blog Post View**
Se registra cuando un usuario ve un post del blog.
- **Evento**: `blog_post_view`
- **Parámetros**: 
  - `post_title`: Título del post
  - `post_slug`: Slug del post

### 3. **Blog Post Share**
Se registra cuando un usuario comparte un post.
- **Evento**: `blog_post_share`
- **Parámetros**:
  - `post_title`: Título del post
  - `post_slug`: Slug del post

### 4. **Contact Form Submit**
Se registra cuando se envía el formulario de contacto.
- **Evento**: `contact_form_submit`
- **Parámetros**:
  - `campaign`: Campaña que trajo al usuario (si existe)
  - Parámetros UTM guardados en la sesión

## Sistema de Gestión de Campañas

### Acceso

Navega a `/admin/campaigns` para gestionar tus campañas de marketing.

### Crear una campaña

1. Click en "Nueva Campaña"
2. Completa los campos:
   - **Nombre**: Nombre interno de la campaña (ej: "Campaña Verano 2024")
   - **utm_campaign**: Identificador único (se convierte a minúsculas con guiones bajos)
   - **utm_source**: Origen del tráfico (ej: facebook, google, email)
   - **utm_medium**: Tipo de medio (ej: cpc, banner, newsletter)
   - **utm_term**: (Opcional) Keywords para búsqueda
   - **utm_content**: (Opcional) Variante del anuncio
   - **Fechas**: Inicio y fin de la campaña (opcional)
   - **Descripción**: Notas sobre la campaña
   - **Activa**: Si la campaña está actualmente activa

### Generar URL con UTM

1. En `/admin/campaigns`, click en "Generar URL"
2. Selecciona una campaña activa
3. Ingresa la URL base (ej: `https://rotom-labs.com`)
4. La URL con parámetros UTM se generará automáticamente
5. Click en "Copiar" para copiar la URL al portapapeles

**Ejemplo de URL generada:**
```
https://rotom-labs.com?utm_campaign=verano_2024&utm_source=facebook&utm_medium=cpc&utm_term=marketing_digital&utm_content=variant_a
```

## Cómo funciona el tracking de campañas

### 1. Captura de UTM
Cuando un usuario visita el sitio con parámetros UTM en la URL:
- Los parámetros se capturan automáticamente
- Se guardan en `sessionStorage` del navegador
- Persisten durante toda la sesión del usuario

### 2. Atribución
Cuando el usuario realiza una conversión (ej: envía el formulario de contacto):
- Los parámetros UTM guardados se incluyen en el evento
- Se registra en Google Analytics con la campaña de origen
- Puedes ver qué campañas generan más conversiones

### 3. Análisis en Google Analytics

En GA4, puedes ver:
- **Tráfico por campaña**: Reports > Acquisition > Traffic acquisition
- **Conversiones por campaña**: Reports > Engagement > Events
- **Eventos personalizados**: Reports > Engagement > Events > Event name

Filtra por:
- `utm_campaign`
- `utm_source`
- `utm_medium`
- Eventos: `blog_post_view`, `blog_post_share`, `contact_form_submit`

## Eventos adicionales disponibles

Puedes usar estos eventos en otros componentes según necesites:

```typescript
import { trackEvent } from '@/lib/analytics';

// Navegación
trackEvent.navClick('contact');

// Landing de campaña
trackEvent.campaignLanding('summer_2024', 'facebook', 'cpc');

// Click en miembro del equipo
trackEvent.teamMemberClick('John Doe');

// Click en link externo
trackEvent.externalLink('https://example.com', 'Partner Website');
```

## Mejores prácticas

### Nomenclatura de UTM

1. **utm_campaign**: Usa nombres descriptivos y únicos
   - ✅ `summer_sale_2024`
   - ❌ `campaign1`

2. **utm_source**: Identifica la plataforma
   - ✅ `facebook`, `google`, `newsletter`, `twitter`
   - ❌ `social`, `ad`

3. **utm_medium**: Tipo de tráfico
   - ✅ `cpc`, `banner`, `email`, `organic`, `referral`
   - ❌ `paid`, `free`

### Ejemplo de estructura de campaña

**Campaña de email**:
```
utm_campaign: newsletter_march_2024
utm_source: mailchimp
utm_medium: email
utm_content: header_cta
```

**Campaña de Facebook Ads**:
```
utm_campaign: product_launch_q1
utm_source: facebook
utm_medium: cpc
utm_content: carousel_ad
utm_term: saas_software
```

## Verificar que funciona

1. **En desarrollo**: Abre las DevTools de Chrome
   - Network tab > Busca requests a `google-analytics.com`
   - Console > Escribe `dataLayer` para ver los eventos

2. **En producción**: 
   - Usa la extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
   - Ve a Google Analytics en tiempo real: Reports > Realtime

## Troubleshooting

### No veo eventos en Google Analytics

1. Verifica que `NEXT_PUBLIC_GA_ID` esté configurado en `.env`
2. Revisa que el ID sea correcto (formato `G-XXXXXXXXXX`)
3. Reinicia el servidor de desarrollo después de cambiar `.env`
4. Los eventos pueden tardar hasta 24-48 horas en aparecer en reportes (pero se ven inmediatamente en Realtime)

### Los UTM no se guardan

1. Verifica que el navegador permita `sessionStorage`
2. Revisa la consola del navegador por errores
3. Asegúrate de que la URL contenga los parámetros UTM correctamente

### Campaña no aparece en el generador

1. Verifica que la campaña esté marcada como "Activa"
2. Refresca la página de `/admin/campaigns`
3. Revisa que el campo `utm_campaign` sea único
