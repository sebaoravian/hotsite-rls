'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TimelineItem {
  id: string
  year: number
  title: string
  description: string
  color: string
}

const colors = ['#1967D2', '#EA4335', '#FBBC04', '#34A853']

export default function TimelineEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<TimelineItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: '',
    color: colors[0]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/timeline')
      const json = await res.json()
      setItems(json)
    } catch (error) {
      console.error('Error fetching timeline:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        // Update existing
        const res = await fetch(`/api/content/timeline/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Item actualizado')
          setEditingId(null)
          resetForm()
          fetchData()
        }
      } else {
        // Create new
        const res = await fetch('/api/content/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Item creado')
          resetForm()
          fetchData()
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('❌ Error al guardar')
    }
  }

  const handleEdit = (item: TimelineItem) => {
    setEditingId(item.id)
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
      color: item.color
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este item?')) return

    try {
      const res = await fetch(`/api/content/timeline/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('✅ Item eliminado')
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('❌ Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      title: '',
      description: '',
      color: colors[0]
    })
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
          <h1 className="text-3xl font-bold mb-2">Our Journey (Timeline)</h1>
          <p className="text-gray-600">Gestiona los hitos de la historia de la compañía</p>
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
          {editingId ? 'Editar Item' : 'Nuevo Item'}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Año</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {colors.map(color => (
                <option key={color} value={color}>
                  {color === '#1967D2' ? 'Azul Google' : 
                   color === '#EA4335' ? 'Rojo Google' :
                   color === '#FBBC04' ? 'Amarillo Google' : 'Verde Google'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
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

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Items Actuales ({items.length})</h2>
        
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay items todavía</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-3 py-1 rounded text-white font-bold text-sm"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.year}
                    </span>
                    <h3 className="font-bold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
