'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ClientLogo {
  id: string
  name: string
  logoUrl: string
  order: number
  published: boolean
  tint?: string | null
}

export default function ClientsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [logos, setLogos] = useState<ClientLogo[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    order: 0,
    published: true,
    tint: '#111111'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/clients/logos')
      const json = await res.json()
      setLogos(json)
    } catch (error) {
      console.error('Error fetching client logos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const res = await fetch(`/api/content/clients/logos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (res.ok) {
          alert('✅ Logo actualizado')
          setEditingId(null)
          resetForm()
          fetchData()
        } else {
          alert('❌ Error: ' + (data.error || 'Error desconocido'))
        }
      } else {
        const res = await fetch('/api/content/clients/logos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (res.ok) {
          alert('✅ Logo creado')
          resetForm()
          fetchData()
        } else {
          alert('❌ Error: ' + (data.error || 'Error desconocido'))
        }
      }
    } catch (error) {
      console.error('Error saving logo:', error)
      alert('❌ Error al guardar')
    }
  }

  const handleEdit = (logo: ClientLogo) => {
    setEditingId(logo.id)
    setFormData({
      name: logo.name,
      logoUrl: logo.logoUrl,
      order: logo.order,
      published: logo.published,
      tint: logo.tint || '#111111'
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este logo?')) return
    try {
      const res = await fetch(`/api/content/clients/logos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('✅ Logo eliminado')
        fetchData()
      } else {
        const data = await res.json()
        alert('❌ Error: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error deleting logo:', error)
      alert('❌ Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', logoUrl: '', order: logos.length, published: true, tint: '#111111' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Our Clients</h1>
          <p className="text-gray-600">Gestiona los logos de clientes (PNG)</p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          ← Volver
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Editar Logo' : 'Nuevo Logo'}</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Empresa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Logo PNG URL
              <span className="text-gray-500 font-normal ml-2">(ruta o URL)</span>
            </label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="/clients/nombre.png o https://..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Orden</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            <label htmlFor="published" className="text-sm font-medium">Publicado</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tint (color)</label>
            <input
              type="color"
              value={formData.tint || '#111111'}
              onChange={(e) => setFormData({ ...formData, tint: e.target.value })}
              className="w-16 h-10 p-1 border border-gray-200 rounded"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Clientes ({logos.length})</h2>
        {logos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay logos todavía</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logos.map((logo) => (
              <div key={logo.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-96 h-48 rounded overflow-hidden flex items-center justify-center">
                    {logo.tint ? (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: logo.tint,
                          WebkitMaskImage: `url(${logo.logoUrl})`,
                          maskImage: `url(${logo.logoUrl})`,
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain'
                        }}
                        aria-label={logo.name}
                      />
                    ) : (
                      <img
                        src={logo.logoUrl}
                        alt={logo.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{logo.name}</h3>
                    <p className="text-xs text-gray-500">Orden: {logo.order}</p>
                    <span className={`text-xs px-2 py-1 rounded ${logo.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {logo.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(logo)} className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Editar</button>
                  <button onClick={() => handleDelete(logo.id)} className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Nota:</strong> Sube los PNG de logos a la carpeta public/clients/ y usa la ruta (ej: /clients/empresa.png). La funcionalidad de upload se implementará más adelante.
        </p>
      </div>
    </div>
  )
}
