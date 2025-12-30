# 📊 Sistema de Tracking de Campañas

## Descripción General

El sistema de tracking de campañas permite identificar de qué fuente proviene cada lead que llena el formulario de contacto. Utiliza parámetros UTM estándar en la URL para rastrear el origen, medio, campaña y otros detalles.

## ¿Cómo Funciona?

### 1. Crear una Campaña

Accede a `/admin/campaigns` y crea una nueva campaña con los siguientes parámetros:

- **utm_campaign**: Nombre de la campaña (ej: `verano_2024`, `black_friday`)
- **utm_source**: Fuente de tráfico (ej: `facebook`, `google`, `email`)
- **utm_medium**: Medio de marketing (ej: `cpc`, `banner`, `newsletter`)
- **utm_term** (opcional): Palabras clave para búsqueda
- **utm_content** (opcional): Variante del anuncio

### 2. Generar URL de Campaña

El sistema genera automáticamente una URL con todos los parámetros UTM. Ejemplo:

```
https://rotom-labs.com?utm_campaign=verano_2024&utm_source=facebook&utm_medium=cpc&utm_term=marketing_digital&utm_content=banner_principal
```

### 3. Usar la URL en tus Campañas

Copia la URL generada y úsala en:
- Posts de redes sociales (Facebook, LinkedIn, Instagram)
- Campañas de Google Ads
- Email marketing
- Banners publicitarios
- Cualquier otro canal de marketing

### 4. Tracking Automático de Leads

Cuando un usuario:
1. Hace clic en tu URL con parámetros UTM
2. Llega al sitio web
3. Llena el formulario de contacto

**El sistema automáticamente captura y guarda** todos los parámetros UTM asociados a ese lead.

### 5. Visualizar Datos de Campaña

En `/admin/contact-submissions` verás:

- Todos los leads recibidos
- Un bloque especial "📊 Origen de la campaña" para leads que vienen de campañas
- Pills de colores mostrando todos los parámetros UTM:
  - **Azul**: utm_campaign
  - **Morado**: utm_source
  - **Rosa**: utm_medium
  - **Naranja**: utm_term
  - **Verde azulado**: utm_content

## Ejemplo de Uso

### Caso: Campaña en Facebook

1. **Crear campaña:**
   - Nombre: "Campaña Facebook Enero"
   - utm_campaign: `fb_enero_2025`
   - utm_source: `facebook`
   - utm_medium: `cpc`
   - utm_content: `video_testimonial`

2. **URL generada:**
   ```
   https://rotom-labs.com?utm_campaign=fb_enero_2025&utm_source=facebook&utm_medium=cpc&utm_content=video_testimonial
   ```

3. **Usar en Facebook:**
   - Crear anuncio en Facebook Ads
   - Pegar la URL en el campo "Website URL"
   - Publicar campaña

4. **Ver resultados:**
   - Los leads que lleguen desde ese anuncio mostrarán:
     - utm_campaign=fb_enero_2025
     - utm_source=facebook
     - utm_medium=cpc
     - utm_content=video_testimonial

## Beneficios

✅ **Saber qué campañas funcionan**: Identifica qué canales generan más leads  
✅ **ROI de Marketing**: Calcula el retorno de inversión por canal  
✅ **Optimización**: Enfoca presupuesto en campañas exitosas  
✅ **Segmentación**: Personaliza el seguimiento según el origen  
✅ **Reportes**: Genera reportes de conversión por fuente  

## Campos de Base de Datos

Los siguientes campos se agregan automáticamente a cada `ContactSubmission`:

```prisma
model ContactSubmission {
  // ... campos básicos
  utm_campaign String?  // Nombre de la campaña
  utm_source   String?  // Fuente (facebook, google, email)
  utm_medium   String?  // Medio (cpc, banner, newsletter)
  utm_term     String?  // Keywords (opcional)
  utm_content  String?  // Variante del anuncio (opcional)
}
```

## Notas Importantes

- ⚠️ **Persistencia**: Los parámetros UTM se capturan cuando el usuario carga la página por primera vez
- ⚠️ **Cookies**: El sistema NO usa cookies, captura los parámetros directamente de la URL
- ⚠️ **URLs limpias**: Si el usuario navega dentro del sitio, los parámetros UTM permanecen asociados al lead
- ⚠️ **Leads sin campaña**: Los contactos orgánicos (sin UTM) no mostrarán el bloque de campaña

## Análisis Avanzado

Puedes exportar los datos a Google Sheets o tu CRM para:
- Crear dashboards de conversión
- Calcular CAC (Customer Acquisition Cost) por canal
- Análisis de funnel por fuente
- A/B testing de creatividades (usando utm_content)
