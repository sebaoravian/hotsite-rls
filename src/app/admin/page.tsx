'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  FileText, Mail, BarChart3, Settings, 
  PenTool, Target, FileStack, Video, 
  Lightbulb, Calendar, Cog, BookOpen, 
  TrendingUp, Users, MessageSquare, 
  Building2, ArrowDown, Inbox
} from 'lucide-react'

export default function AdminPage() {
  const [contactFormsCount, setContactFormsCount] = useState(0)
  const [blogPostsCount, setBlogPostsCount] = useState(0)
  const [campaignsCount, setCampaignsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      // Fetch contact submissions count (only NEW and CONTACTED)
      fetch('/api/contact/submissions')
        .then(res => res.json())
        .then(data => {
          const unread = data.filter((s: any) => s.status === 'NEW' || s.status === 'CONTACTED').length
          setContactFormsCount(unread)
        }),
      
      // Fetch published blog posts count
      fetch('/api/blog')
        .then(res => res.json())
        .then(data => {
          const publishedCount = data.posts?.filter((p: any) => p.published).length || 0
          setBlogPostsCount(publishedCount)
        }),
      
      // Fetch active campaigns count
      fetch('/api/campaigns')
        .then(res => res.json())
        .then(data => {
          const activeCount = data.filter((c: any) => c.active).length
          setCampaignsCount(activeCount)
        })
    ])
    .catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const contentSections = [
    { name: 'Hero Section', href: '/admin/content/hero', icon: Video, description: 'Video, título, descripción y botones principales' },
    { name: 'Statement', href: '/admin/content/statement', icon: Lightbulb, description: 'Simplicity is the ultimate technology' },
    { name: 'Our Journey', href: '/admin/content/timeline', icon: Calendar, description: 'Línea de tiempo de la empresa' },
    { name: 'Our Services', href: '/admin/content/services', icon: Cog, description: 'Slider de servicios (mockup + descripción)' },
    { name: 'Capabilities', href: '/admin/content/capabilities', icon: Cog, description: 'Capacidades técnicas' },
    { name: 'Principles', href: '/admin/content/principles', icon: BookOpen, description: 'Principios de desarrollo' },
    { name: 'Impact', href: '/admin/content/impact', icon: TrendingUp, description: 'Métricas e impacto' },
    { name: 'Our Clients', href: '/admin/content/clients', icon: Building2, description: 'Logos de clientes' },
    { name: 'Team', href: '/admin/content/team', icon: Users, description: 'Equipo de RotomLabs' },
    { name: 'Contact', href: '/admin/content/contact', icon: MessageSquare, description: "Let's build what's next" },
    { name: 'Offices', href: '/admin/content/offices', icon: Building2, description: 'Oficinas globales' },
    { name: 'Footer', href: '/admin/content/footer', icon: ArrowDown, description: 'Redes sociales y copyright' },
    { name: 'Submissions', href: '/admin/contact-submissions', icon: Inbox, description: 'Contactos recibidos' }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Gestiona todo el contenido del sitio desde aquí</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/blog" className="group">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">BLOG</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : blogPostsCount}
            </p>
            <p className="text-sm text-gray-600">Posts publicados</p>
          </div>
        </Link>
        
        <Link href="/admin/contact-submissions" className="group">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">CONTACTOS</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : contactFormsCount}
            </p>
            <p className="text-sm text-gray-600">Mensajes pendientes</p>
          </div>
        </Link>
        
        <Link href="/admin/campaigns" className="group">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">CAMPAÑAS</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : campaignsCount}
            </p>
            <p className="text-sm text-gray-600">Campañas activas</p>
          </div>
        </Link>

        <Link href="/admin/settings" className="group">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">CONFIGURACIÓN</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">
              Analytics & Keys
            </p>
            <p className="text-sm text-gray-600">Códigos y claves</p>
          </div>
        </Link>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Blog & Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Blog & Contenido</h2>
          </div>
          <div className="space-y-2">
            <Link 
              href="/admin/blog/new"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Crear nuevo post</span>
                <span className="text-gray-400 group-hover:text-gray-600">→</span>
              </div>
            </Link>
            <Link 
              href="/admin/blog"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Gestionar posts</span>
                <span className="text-gray-400 group-hover:text-gray-600">→</span>
              </div>
            </Link>
            <Link 
              href="/blog"
              target="_blank"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Ver blog público</span>
                <span className="text-gray-400 group-hover:text-gray-600">↗</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Marketing */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Marketing & Analytics</h2>
          </div>
          <div className="space-y-2">
            <Link 
              href="/admin/campaigns"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Gestionar campañas</span>
                <span className="text-gray-400 group-hover:text-gray-600">→</span>
              </div>
            </Link>
            <Link 
              href="/admin/settings"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Configurar Analytics</span>
                <span className="text-gray-400 group-hover:text-gray-600">→</span>
              </div>
            </Link>
            <Link 
              href="/admin/contact-submissions"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Ver contactos</span>
                <span className="text-gray-400 group-hover:text-gray-600">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
            <FileStack className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Secciones del Sitio</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {contentSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block p-4 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-start gap-3">
                <section.icon className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-black mb-1 truncate">
                    {section.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
