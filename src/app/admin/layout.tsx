import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/session'
import Link from 'next/link'
import Image from 'next/image'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAuth()
  } catch {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logo.png" 
                  alt="RotomLabs" 
                  className="h-8 w-auto" 
                />
              </Link>
              <nav className="flex gap-6 text-sm">
                <Link href="/admin" className="text-gray-600 hover:text-black">
                  Dashboard
                </Link>
                <Link href="/admin/blog" className="text-gray-600 hover:text-black">
                  Blog
                </Link>
                <Link href="/admin/campaigns" className="text-gray-600 hover:text-black">
                  Campañas
                </Link>
                <Link href="/admin/settings" className="text-gray-600 hover:text-black">
                  Configuración
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-black"
              >
                Ver sitio
              </a>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
