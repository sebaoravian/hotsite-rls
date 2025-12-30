'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { icons, IconName } from '@/components/icons'

interface PrincipleItem {
  id: string
  title: string
  description: string
  icon: string
  color: string
  order: number
}

const colors = ['#1967D2', '#EA4335', '#FBBC04', '#34A853']
const iconOptions: IconName[] = ['check', 'building', 'shield', 'trending', 'chart', 'cloud', 'bulb', 'globe']

export default function PrinciplesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<PrincipleItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'check' as IconName,
    color: colors[0],
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/principles/items')
      const json = await res.json()
      setItems(json)
    } catch (error) {
      console.error('Error fetching principles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const res = await fetch(`/api/content/principles/items/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Principio actualizado')
          setEditingId(null)
          resetForm()
          fetchData()
        }
      } else {
        const res = await fetch('/api/content/principles/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Principio creado')
          resetForm()
          fetchData()
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('❌ Error al guardar')
    }
  }

  const handleEdit = (item: PrincipleItem) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon as IconName,
      color: item.color,
      order: item.order
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este principio?')) return

    try {
      const res = await fetch(`/api/content/principles/items/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('✅ Principio eliminado')
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('❌ Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'check' as IconName,
      color: colors[0],
      order: items.length
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
          <h1 className="text-3xl font-bold mb-2">Our Principles</h1>
          <p className="text-gray-600">Gestiona los principios de desarrollo</p>
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
          {editingId ? 'Editar Principio' : 'Nuevo Principio'}
        </h2>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Icono</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value as IconName })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {iconOptions.map(iconName => (
                <option key={iconName} value={iconName}>
                  {iconName.charAt(0).toUpperCase() + iconName.slice(1)}
                </option>
              ))}
            </select>
            {/* Preview */}
            <div className="mt-2 flex justify-center p-3 border border-gray-200 rounded-lg bg-gray-50" style={{ color: formData.color }}>
              {icons[formData.icon]}
            </div>
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
        <h2 className="text-lg font-bold mb-4">Principios Actuales ({items.length})</h2>
        
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay principios todavía</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div style={{ color: item.color }}>
                      {icons[item.icon as IconName] || icons.check}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <span className="text-xs text-gray-500">Orden: {item.order}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
