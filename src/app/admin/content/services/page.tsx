'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ServiceItem {
  id: string
  title: string
  description: string
  mockupUrl: string
  order: number
}

export default function ServicesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<ServiceItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mockupUrl: '',
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/services/items')
      const json = await res.json()
      setItems(json)
      if (json.length && !formData.order) {
        setFormData(prev => ({ ...prev, order: json.length }))
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const res = await fetch(`/api/content/services/items/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (res.ok) {
          alert('✅ Servicio actualizado')
          setEditingId(null)
          resetForm()
          fetchData()
        }
      } else {
        const res = await fetch('/api/content/services/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (res.ok) {
          alert('✅ Servicio creado')
          resetForm()
          fetchData()
        }
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('❌ Error al guardar')
    }
  }

  const handleEdit = (item: ServiceItem) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      description: item.description,
      mockupUrl: item.mockupUrl,
      order: item.order
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este servicio?')) return
    try {
      const res = await fetch(`/api/content/services/items/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('✅ Servicio eliminado')
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('❌ Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', mockupUrl: '', order: items.length })
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
          <h1 className="text-3xl font-bold mb-2">Services</h1>
          <p className="text-gray-600">Gestiona los servicios que mostramos en el slider</p>
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
        <h2 className="text-lg font-bold mb-4">
          {editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Orden</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">URL de Mockup (imagen)</label>
          <input
            type="text"
            value={formData.mockupUrl}
            onChange={(e) => setFormData({ ...formData, mockupUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="/path/imagen.png o https://..."
            required
          />
          <div className="mt-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
            {formData.mockupUrl ? (
              <img src={formData.mockupUrl} alt="Preview" className="h-48 object-contain mx-auto" />
            ) : (
              <p className="text-sm text-gray-500 text-center">Agrega la URL de un mockup</p>
            )}
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
        <h2 className="text-lg font-bold mb-4">Servicios actuales ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay servicios todavía</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 border border-gray-200 rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img src={item.mockupUrl} alt={item.title} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <span className="text-xs text-gray-500">Orden: {item.order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Editar</button>
                    <button onClick={() => handleDelete(item.id)} className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50">Eliminar</button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
