# 🎨 Logo y Branding - RotomLabs

## Logo

El logo de RotomLabs está ubicado en `/public/logo.svg`

### Uso en Componentes

El logo se utiliza con Next.js Image para optimización automática:

```tsx
import Image from 'next/image'

<Image 
  src="/logo.svg" 
  alt="RotomLabs" 
  width={140} 
  height={32} 
  className="h-8 w-auto" 
/>
```

### Ubicaciones del Logo

- ✅ **Navbar principal** - `/src/components/Navbar.tsx`
- ✅ **Página de login** - `/src/app/login/page.tsx`
- ✅ **Admin panel** - `/src/app/admin/layout.tsx`
- ✅ **Blog público** - `/src/app/blog/page.tsx`
- ✅ **Posts del blog** - `/src/app/blog/[slug]/page.tsx`

## Favicon

El favicon está en `/public/favicon.svg` y se configura automáticamente en el metadata.

## Dominio

**Dominio oficial**: `rotom-labs.com`

### Configuración

El dominio está configurado en:

1. **Variables de entorno** (`.env`):
```env
NEXT_PUBLIC_SITE_URL="https://rotom-labs.com"
```

2. **Metadata SEO** (`src/app/layout.tsx`):
```tsx
metadataBase: new URL('https://rotom-labs.com')
```

3. **Footer** (`src/components/Footer.tsx`):
```tsx
© 2025 RotomLabs · rotom-labs.com
```

## Colores de Marca

Basado en el logo proporcionado:

- **Azul Principal**: `#0066CC` - Color corporativo principal
- **Blanco**: `#FFFFFF` - Fondos y texto en elementos oscuros
- **Negro**: `#111111` - Texto principal
- **Grises**: Variaciones para jerarquía visual

### Uso en Tailwind

```tsx
// Texto azul
className="text-[#0066CC]"

// Fondo azul
className="bg-[#0066CC]"

// Borde azul
className="border-[#0066CC]"
```

## Personalizar el Logo

Para usar tu logo real:

1. Reemplaza `/public/logo.svg` con tu archivo SVG
2. Ajusta las dimensiones en los componentes si es necesario
3. El logo se optimiza automáticamente con Next.js Image

### Formatos Recomendados

- **SVG**: Ideal para logos (escalable, ligero)
- **PNG**: Alternativa con transparencia
- **WebP**: Optimizado para web

## Assets Adicionales

Puedes agregar más assets en `/public/`:

```
public/
├── logo.svg           # Logo principal
├── favicon.svg        # Favicon
├── og-image.jpg       # Imagen para redes sociales (opcional)
└── images/           # Otras imágenes
```

---

**Nota**: Recuerda actualizar el dominio en producción con tus DNS y configuración de hosting.
