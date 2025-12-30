'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  order: number
}

interface FooterSettings {
  id: string
  copyrightText: string
  socialLinks: SocialLink[]
}

export default function FooterEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [footer, setFooter] = useState<FooterSettings | null>(null)
  const [copyrightText, setCopyrightText] = useState('')
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [linkForm, setLinkForm] = useState({
    name: '',
    url: '',
    icon: '',
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/footer')
      const data = await res.json()
      setFooter(data)
      setCopyrightText(data.copyrightText)
    } catch (error) {
      console.error('Error fetching footer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await fetch('/api/content/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ copyrightText })
      })

      alert('Footer actualizado correctamente')
      fetchData()
    } catch (error) {
      console.error('Error updating footer:', error)
      alert('Error al actualizar footer')
    }
  }

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingLinkId) {
        // Update
        await fetch(`/api/content/footer/social/${editingLinkId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(linkForm)
        })
      } else {
        // Create
        await fetch('/api/content/footer/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...linkForm,
            footerId: footer?.id
          })
        })
      }

      setLinkForm({ name: '', url: '', icon: '', order: 0 })
      setEditingLinkId(null)
      fetchData()
    } catch (error) {
      console.error('Error saving social link:', error)
      alert('Error al guardar enlace social')
    }
  }

  const handleEditLink = (link: SocialLink) => {
    setEditingLinkId(link.id)
    setLinkForm({
      name: link.name,
      url: link.url,
      icon: link.icon,
      order: link.order
    })
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('¿Eliminar este enlace social?')) return

    try {
      await fetch(`/api/content/footer/social/${id}`, {
        method: 'DELETE'
      })
      fetchData()
    } catch (error) {
      console.error('Error deleting social link:', error)
      alert('Error al eliminar enlace')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Editar Footer</h1>
        </div>

        {/* Copyright Text */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Texto de Copyright</h2>
          <form onSubmit={handleSaveFooter}>
            <div className="mb-4">
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Copyright 2025"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar Copyright
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Enlaces Sociales</h2>
          
          {/* Lista de enlaces */}
          <div className="space-y-3 mb-6">
            {footer?.socialLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{link.name}</div>
                  <div className="text-sm text-gray-500">{link.url}</div>
                  <div className="text-xs text-gray-400">Ícono: {link.icon} | Orden: {link.order}</div>
                </div>
                <button
                  onClick={() => handleEditLink(link)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* Formulario para agregar/editar */}
          <form onSubmit={handleSaveLink} className="border-t pt-4">
            <h3 className="font-medium mb-3 text-gray-900">
              {editingLinkId ? 'Editar Enlace' : 'Agregar Enlace'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={linkForm.name}
                  onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="LinkedIn"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">URL</label>
                <input
                  type="url"
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/company/..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Ícono (Lucide)</label>
                <input
                  type="text"
                  value={linkForm.icon}
                  onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Linkedin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Orden</label>
                <input
                  type="number"
                  value={linkForm.order}
                  onChange={(e) => setLinkForm({ ...linkForm, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingLinkId ? 'Actualizar' : 'Agregar'} Enlace
              </button>
              {editingLinkId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingLinkId(null)
                    setLinkForm({ name: '', url: '', icon: '', order: 0 })
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
