# RotomLabs Website

Sitio web corporativo de RotomLabs construido con Next.js 14+, TypeScript, Tailwind CSS y Prisma.

## 🚀 Características

- ✅ **Next.js 16 App Router** - Última versión con RSC (React Server Components)
- ✅ **TypeScript** - Tipado fuerte en todo el proyecto
- ✅ **Tailwind CSS v4** - Estilos modernos y responsivos
- ✅ **Prisma ORM** - Manejo de base de datos con SQLite (dev) o PostgreSQL (prod)
- ✅ **Autenticación por Password** - Sistema simple de acceso con JWT
- ✅ **Blog System** - Sistema completo de blog con admin panel
- ✅ **Panel de Administración** - Gestión de contenido
- ✅ **Componentes Modulares** - Fácil de mantener y escalar

## 📋 Requisitos Previos

- Node.js 18+ 
- npm (incluido con Node.js)

## 🛠️ Instalación y Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar base de datos

El proyecto está configurado para usar SQLite en desarrollo (no requiere instalación adicional).

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear base de datos y tablas
npm run db:push

# Crear usuario admin inicial
npm run db:seed
```

**Credenciales por defecto:**
- Password del sitio: `rotomlabs2024`
- Email admin (para blog): `admin@rotom-labs.com`
- Password admin: `admin123`

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔐 Acceso al Sitio

1. Abre [http://localhost:3000](http://localhost:3000)
2. Serás redirigido a `/login`
3. Ingresa el password: `rotomlabs2024`
4. Accederás al sitio principal

## 📁 Estructura del Proyecto

```
site/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.js                # Script para poblar BD inicial
│   └── dev.db                 # Base de datos SQLite (no versionada)
├── src/
│   ├── app/
│   │   ├── admin/            # Panel de administración
│   │   │   ├── blog/         # Gestión de blog
│   │   │   └── page.tsx      # Dashboard admin
│   │   ├── api/
│   │   │   ├── auth/         # Endpoints de autenticación
│   │   │   └── blog/         # API del blog
│   │   ├── blog/             # Páginas públicas del blog
│   │   ├── login/            # Página de login
│   │   ├── layout.tsx        # Layout principal
│   │   ├── globals.css       # Estilos globales
│   │   └── page.tsx          # Homepage
│   ├── components/           # Componentes reutilizables
│   │   ├── About.tsx
│   │   ├── Capabilities.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Impact.tsx
│   │   ├── Navbar.tsx
│   │   ├── Philosophy.tsx
│   │   ├── Principles.tsx
│   │   ├── Statement.tsx
│   │   ├── Team.tsx
│   │   └── Timeline.tsx
│   └── lib/
│       ├── auth.ts           # Utilidades de autenticación
│       ├── prisma.ts         # Cliente de Prisma
│       └── session.ts        # Gestión de sesiones
├── .env                      # Variables de entorno (no versionado)
├── .env.example              # Template de variables de entorno
├── next.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 📝 Gestión del Blog

### Crear un nuevo post

1. Accede al panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)
2. Ve a la sección "Blog"
3. Click en "New Post"
4. Completa el formulario:
   - **Title**: Título del post
   - **Slug**: URL amigable (se genera automáticamente del título)
   - **Excerpt**: Resumen breve
   - **Content**: Contenido completo
   - **Published**: Marcar para publicar inmediatamente

### Ver posts publicados

Los posts publicados están disponibles en [http://localhost:3000/blog](http://localhost:3000/blog)

## 🗄️ Base de Datos

### Desarrollo (SQLite)

Por defecto, el proyecto usa SQLite en desarrollo (archivo `dev.db`). No requiere instalación adicional.

**Modelos principales:**
- **User**: Usuarios del sistema
- **Post**: Posts del blog

### Producción (PostgreSQL)

Para producción, cambia el schema de Prisma:

1. En `prisma/schema.prisma`, cambia:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Actualiza `DATABASE_URL` en `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/rotomlabs?schema=public"
```

3. Sincroniza la base de datos:
```bash
npm run db:push
npm run db:seed
```

### Comandos útiles de Prisma

```bash
# Generar cliente de Prisma
npm run db:generate

# Sincronizar esquema con BD (desarrollo)
npm run db:push

# Poblar BD con datos iniciales
npm run db:seed

# Abrir Prisma Studio (GUI para la BD)
npm run db:studio
```

## 🚢 Deployment

### Opción 1: Vercel (Recomendado)

1. Sube el repositorio a GitHub
2. Conecta con Vercel
3. Configura las variables de entorno
4. Despliega automáticamente

### Opción 2: Manual

```bash
npm run build
npm start
```

### Variables de entorno en producción

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
ADMIN_PASSWORD="strong-password-here"
JWT_SECRET="random-secret-key-min-32-chars"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NODE_ENV="production"
```

⚠️ **Importante**: Cambia TODOS los passwords y secretos en producción!

## 🎨 Personalización

### Colores y estilos

Los estilos están definidos en:
- `src/app/globals.css` - Variables CSS y estilos globales
- Tailwind CSS v4 se configura directamente en CSS con `@import "tailwindcss"`

### Componentes

Todos los componentes están en `src/components/` y son fáciles de modificar:

- **Hero.tsx** - Sección principal con call-to-actions
- **About.tsx** - Información sobre la empresa
- **Capabilities.tsx** - Capacidades técnicas en tarjetas
- **Impact.tsx** - Métricas de impacto
- **Principles.tsx** - Principios de trabajo
- **Team.tsx** - Miembros del equipo
- **Timeline.tsx** - Historia de la empresa
- **Philosophy.tsx** - Filosofía de trabajo
- **Contact.tsx** - Formulario de contacto
- **Navbar.tsx** - Barra de navegación
- **Footer.tsx** - Pie de página

Cada componente es independiente y puede ser modificado sin afectar a los demás.

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm start            # Iniciar servidor de producción
npm run lint         # Ejecutar ESLint
npm run db:generate  # Generar cliente de Prisma
npm run db:push      # Sincronizar esquema con BD
npm run db:seed      # Poblar BD con datos iniciales
npm run db:studio    # Abrir Prisma Studio (GUI)
```

## 🔒 Seguridad

- El password se valida en el servidor
- JWT con httpOnly cookies
- Todas las rutas admin requieren autenticación
- Variables sensibles en `.env` (no versionado)

## 🤝 Contribuir

1. Crea una rama para tu feature
2. Haz tus cambios
3. Asegúrate de que todo funcione
4. Crea un Pull Request

## 📄 Licencia

© RotomLabs - Todos los derechos reservados

---

**Desarrollado con ❤️ por RotomLabs**
