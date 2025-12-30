# SEO Implementation Guide - RotomLabs Hotsite

## ✅ Implementación Completa de SEO

### 🎯 Configuración SEO desde el Admin

**NUEVO**: Ahora puedes configurar todo el SEO del sitio desde el panel de administración sin tocar código.

#### Acceso a la Configuración
- Ve a: `http://localhost:3100/admin/settings`
- Encontrarás 4 secciones principales:

#### 1. **SEO General**
Configura los metadatos principales del sitio:
- **Nombre del Sitio**: Aparece en el template del título (ej: "Página | RotomLabs")
- **Título SEO Principal**: Máx 60 caracteres (con contador)
- **Descripción del Sitio**: Máx 160 caracteres (con contador)
- **Keywords**: Palabras clave separadas por comas
- **Imagen Open Graph**: URL de imagen por defecto (1200x630px recomendado)
- **URL Canónica**: URL principal del sitio
- **Locale**: Código de idioma/región (ej: en_US)
- **Idioma**: Código de idioma (ej: en)

#### 2. **Google Services**
Integración con herramientas de Google:
- **Google Analytics ID**: Formato G-XXXXXXXXXX para GA4
- **Google Site Verification**: Código para Search Console
- **Google Tag Manager ID**: Formato GTM-XXXXXXX (opcional)

#### 3. **Redes Sociales**
Configuración de plataformas sociales:
- **Twitter Handle**: Con @ para Twitter Cards
- **Facebook App ID**: Solo si usas Facebook SDK
- **LinkedIn URL**: URL de la página de empresa
- **Instagram URL**: URL del perfil

#### 4. **Seguridad**
Configuraciones críticas (requieren reinicio del servidor):
- **Contraseña del Sitio**: Para acceso al sitio principal
- **Session Secret**: Clave secreta para sesiones

#### Comportamiento
- ✅ **SEO y Redes Sociales**: Se guardan en la base de datos, se aplican inmediatamente
- ⚠️ **Seguridad**: Se guardan en .env, requieren reiniciar el servidor
- 🔄 **Auto-aplicación**: Los cambios de SEO se reflejan automáticamente en:
  - Meta tags del layout
  - Open Graph tags
  - Twitter Cards
  - Structured Data (JSON-LD)
  - Google Analytics/GTM scripts

### 1. **Archivos Fundamentales Creados**

#### `/public/robots.txt`
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://rotom-labs.com/sitemap.xml
```

#### `/src/app/sitemap.ts`
- Sitemap dinámico que genera automáticamente:
  - Página principal (priority: 1.0)
  - Página de blog (priority: 0.8)
  - Todos los posts publicados (priority: 0.7)
- Se actualiza automáticamente cuando se publican nuevos posts

#### `/src/app/manifest.ts`
- PWA Manifest para instalabilidad
- Configuración completa con nombre, iconos, colores

### 2. **Structured Data (Schema.org / JSON-LD)**

#### `/src/components/StructuredData.tsx`
Componentes creados:
- **OrganizationSchema**: Información de la empresa (ahora dinámico desde settings)
- **WebsiteSchema**: Información del sitio web (ahora dinámico desde settings)
- **BlogPostSchema**: Datos estructurados para cada post del blog
- **BreadcrumbSchema**: Navegación breadcrumb para SEO

**Uso:**
```tsx
<OrganizationSchema />
<WebsiteSchema />
<BlogPostSchema {...post} />
<BreadcrumbSchema items={[...]} />
```

**IMPORTANTE**: OrganizationSchema y WebsiteSchema ahora son componentes async que leen de la base de datos.

### 3. **Meta Tags Mejorados**

#### Layout Principal (`/src/app/layout.tsx`)
**Ahora dinámico**: El layout lee la configuración desde la base de datos y genera los meta tags automáticamente.

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  
  return {
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    // ... todos los demás metadatos generados dinámicamente
  }
}
```
    template: "%s | RotomLabs", // Para páginas internas
  },
  description: "...",
  keywords: ["cloud architecture", "data engineering", ...],
  authors: [{ name: "RotomLabs" }],
  openGraph: {
    title: "...",
    description: "...",
    images: [{ url: '/logo.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@rotom_labs',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {...},
  },
}
```

#### Posts del Blog (`/src/app/blog/[slug]/page.tsx`)
- **generateMetadata()**: Genera meta tags dinámicos para cada post
- Usa campos SEO del post o fallbacks inteligentes:
  - `seoTitle` → `title`
  - `seoDescription` → `excerpt` → `title`
  - `ogImage` → `coverImage` → `/logo.png`
- Open Graph completo con article type
- Twitter Cards optimizadas
- Canonical URLs

### 4. **Campos SEO en Base de Datos**

#### Modelo Post actualizado:
```prisma
model Post {
  // Campos existentes...
  
  // Nuevos campos SEO
  seoTitle       String?  // Meta title (max 60 chars)
  seoDescription String?  // Meta description (max 160 chars)
  seoKeywords    String?  // Keywords separados por comas
  ogImage        String?  // Open Graph image URL (1200x630)
  canonicalUrl   String?  // Canonical URL si el contenido está duplicado
}
```

### 5. **Formulario de Creación de Posts**

#### Campos agregados en `/src/app/admin/blog/new/page.tsx`:
- **SEO Title** (max 60 chars) con contador
- **SEO Description** (max 160 chars) con contador
- **SEO Keywords** (comma separated)
- **OG Image** (1200x630px recomendado)

#### API actualizada (`/src/app/api/blog/route.ts`):
- POST endpoint acepta y guarda campos SEO
- GET endpoints retornan campos SEO

### 6. **Componentes de Cliente Optimizados**

#### `/src/app/blog/[slug]/BlogPostClient.tsx`
- Incluye Structured Data (BlogPostSchema, BreadcrumbSchema)
- Semantic HTML con tags apropiados (`<article>`, `<time>`)
- dateTime attribute en elementos time

## 📋 Checklist SEO

### Meta Tags
- ✅ Title tag dinámico (60 chars max)
- ✅ Meta description (160 chars max)
- ✅ Meta keywords
- ✅ Canonical URLs
- ✅ Open Graph (title, description, image, url, type)
- ✅ Twitter Cards (title, description, image, creator)
- ✅ Robots meta

### Structured Data
- ✅ Organization schema
- ✅ Website schema
- ✅ BlogPosting schema
- ✅ BreadcrumbList schema

### Archivos Técnicos
- ✅ robots.txt
- ✅ Sitemap XML dinámico
- ✅ PWA Manifest

### Optimizaciones
- ✅ Semantic HTML
- ✅ Alt text en imágenes
- ✅ Títulos jerárquicos (H1, H2, etc)
- ✅ URLs amigables (slugs)
- ✅ Velocidad de carga optimizada (Next.js)

## 🎯 Mejores Prácticas

### Para Crear Nuevos Posts:

1. **Title**: Claro y descriptivo (40-60 chars)
2. **Slug**: URLs amigables, sin espacios ni caracteres especiales
3. **Excerpt**: Resume el contenido (120-160 chars)
4. **SEO Title**: Optimizado para búsqueda (50-60 chars)
5. **SEO Description**: Call-to-action + keywords (150-160 chars)
6. **SEO Keywords**: 3-5 palabras clave relevantes, separadas por comas
7. **OG Image**: 1200x630px, con texto legible, representa el contenido
8. **Content**: Usar encabezados (H2, H3), párrafos cortos, listas

### Keywords Strategy:
- **Primary keyword**: En title, H1, primer párrafo
- **Secondary keywords**: En H2, contenido, meta description
- **Long-tail keywords**: En SEO keywords field

### Images:
- Tamaño óptimo OG: 1200x630px
- Cover images: Mínimo 1200px ancho
- Alt text descriptivo (no implementado aún en editor)

## 🔍 Google Search Console

### Próximos Pasos:
1. **Verificar dominio** en Google Search Console
   - Agregar meta tag de verificación en `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
2. **Enviar sitemap**: `https://rotom-labs.com/sitemap.xml`
3. **Monitorear**:
   - Impresiones y clicks
   - Coverage issues
   - Core Web Vitals
   - Mobile usability

## 📊 Analytics y Tracking

### Ya Implementado:
- ✅ Google Analytics (configurable desde admin/settings)
- ✅ Google Tag Manager (configurable desde admin/settings)
- ✅ UTM tracking para campañas
- ✅ Event tracking en blog posts

### Configuración:
**Ya NO necesitas variables de entorno** para SEO y Analytics. Todo se configura desde:
- `http://localhost:3100/admin/settings`

Las únicas variables en .env son:
```env
# Base de datos (requerido)
DATABASE_URL="file:./dev.db"

# Seguridad (requerido - configurables desde admin)
SITE_PASSWORD=rotomlabs2024
SESSION_SECRET=your-secret-key
```

### Migración de Variables de Entorno:
Si tenías `NEXT_PUBLIC_GA_ID` o `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` en .env, ahora debes:
1. Ir a `/admin/settings`
2. Ingresar esos valores en los campos correspondientes
3. Guardar la configuración
4. Los valores en .env ya no se usan (el sistema prioriza los de la base de datos)

## 🎯 Mejores Prácticas para Configuración SEO

### Título SEO (Site Title)
- ✅ **Bueno**: "RotomLabs — Digital Backbone for Global Companies"
- ❌ **Malo**: "Welcome to Our Website | Best Company Ever"
- Máximo 60 caracteres
- Incluye la propuesta de valor principal
- Evita keyword stuffing

### Descripción del Sitio
- ✅ **Buena**: "RotomLabs builds the digital backbone behind global companies: cloud architecture, data, AI, mobile platforms and secure integrations."
- ❌ **Mala**: "We are the best company in the world offering the best services."
- Máximo 160 caracteres
- Incluye call-to-action implícito
- Menciona servicios principales
- Debe ser atractiva para hacer click

### Keywords
- Máximo 5-7 keywords relevantes
- Separadas por comas
- Ejemplo: "cloud architecture, data engineering, AI development, mobile platforms, secure integrations"
- Evita repetir palabras que ya están en título/descripción

### Imagen Open Graph
- Tamaño recomendado: **1200x630 píxeles**
- Formato: PNG o JPG (preferir PNG)
- Peso máximo: 8MB (ideal < 1MB)
- Debe incluir: Logo + Tagline o mensaje clave
- Fondo de color sólido o degradado simple
- Texto legible en preview pequeño

### URLs Canónicas
- Siempre sin trailing slash: ✅ `https://rotom-labs.com` ❌ `https://rotom-labs.com/`
- Usar HTTPS en producción
- Consistente en toda la configuración

### Handles de Redes Sociales
- Twitter: Incluir el `@` → `@rotom_labs`
- LinkedIn/Instagram: URL completa → `https://linkedin.com/company/rotomlabs`
- Verificar que las URLs sean públicas y accesibles

## 📋 Checklist de Configuración SEO

### Al Configurar por Primera Vez:
- [ ] Ingresar título y descripción optimizados
- [ ] Agregar 5-7 keywords relevantes
- [ ] Subir imagen OG de 1200x630px
- [ ] Configurar URL canónica correcta
- [ ] Ingresar Google Analytics ID
- [ ] Configurar Google Site Verification
- [ ] Verificar handles de redes sociales
- [ ] Configurar locale e idioma correctos

### Después de Configurar:
- [ ] Verificar meta tags en el código fuente (Ctrl+U)
- [ ] Probar con Facebook Sharing Debugger
- [ ] Probar con Twitter Card Validator
- [ ] Verificar en Google Rich Results Test
- [ ] Confirmar que Analytics está trackeando
- [ ] Verificar sitemap.xml se genera correctamente

### En Producción:
- [ ] Cambiar URL canónica a dominio de producción
- [ ] Actualizar imagen OG con URL absoluta
- [ ] Configurar Google Search Console
- [ ] Verificar robots.txt está accesible
- [ ] Confirmar sitemap está indexándose
- [ ] Revisar Core Web Vitals en PageSpeed Insights

## 🚀 Testing SEO

### Herramientas Recomendadas:
1. **Google Search Console**: Verificación y monitoreo
2. **Google Rich Results Test**: Validar structured data
3. **Facebook Sharing Debugger**: Validar Open Graph
4. **Twitter Card Validator**: Validar Twitter Cards
5. **Lighthouse**: Performance y SEO score
6. **Screaming Frog**: Crawl completo del sitio

### Comandos Útiles:
```bash
# Verificar sitemap
curl https://rotom-labs.com/sitemap.xml

# Verificar robots.txt
curl https://rotom-labs.com/robots.txt

# Verificar manifest
curl https://rotom-labs.com/manifest.webmanifest
```

## ✨ Features Adicionales Disponibles

### Next.js Image Optimization:
- Usar `<Image>` component para optimización automática
- Lazy loading
- Responsive images
- WebP conversion

### Performance:
- ✅ Server Components por defecto
- ✅ Route-based code splitting
- ✅ Optimistic UI updates
- ✅ Streaming SSR

## 📝 Notas Importantes

1. **SEO Title vs Title**: Si no se especifica SEO Title, se usa el Title del post
2. **SEO Description vs Excerpt**: Si no se especifica SEO Description, se usa el Excerpt
3. **OG Image vs Cover Image**: Si no se especifica OG Image, se usa Cover Image
4. **Canonical URLs**: Solo usar si el contenido está duplicado en otro sitio
5. **Keywords**: No abusar, 3-5 keywords relevantes es suficiente

## 🔄 Mantenimiento

### Mensual:
- Revisar Search Console por errores
- Actualizar sitemap si hay cambios estructurales
- Verificar Core Web Vitals

### Trimestral:
- Actualizar keywords basado en performance
- Revisar y optimizar meta descriptions de posts populares
- Analizar competencia y ajustar estrategia

### Anual:
- Audit SEO completo
- Actualizar structured data si cambia el schema
- Revisar y actualizar contenido evergreen
