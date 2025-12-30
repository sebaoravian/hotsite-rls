'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { icons, IconName } from '@/components/icons'

const iconOptions = ['globe', 'users', 'server', 'cpu', 'cloud', 'chart', 'shield', 'trending']

interface ImpactItem {
  id: string
  label: string
  number: string
  icon: string
  color: string
  order: number
}

const colors = ['#1967D2', '#EA4335', '#FBBC04', '#34A853']

export default function ImpactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<ImpactItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    number: '',
    icon: 'globe',
    color: colors[0],
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/impact/items')
      const json = await res.json()
      setItems(json)
    } catch (error) {
      console.error('Error fetching impact:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const res = await fetch(`/api/content/impact/items/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Métrica actualizada')
          setEditingId(null)
          resetForm()
          fetchData()
        }
      } else {
        const res = await fetch('/api/content/impact/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Métrica creada')
          resetForm()
          fetchData()
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('❌ Error al guardar')
    }
  }

  const handleEdit = (item: ImpactItem) => {
    setEditingId(item.id)
    setFormData({
      label: item.label,
      number: item.number,
      icon: item.icon,
      color: item.color,
      order: item.order
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta métrica?')) return

    try {
      const res = await fetch(`/api/content/impact/items/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('✅ Métrica eliminada')
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('❌ Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      label: '',
      number: '',
      icon: 'globe',
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
          <h1 className="text-3xl font-bold mb-2">Impact Metrics</h1>
          <p className="text-gray-600">Gestiona las métricas de impacto</p>
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
          {editingId ? 'Editar Métrica' : 'Nueva Métrica'}
        </h2>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Icono</label>
            <div className="flex items-center gap-3">
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {iconOptions.map(iconName => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>
              <div className="w-12 h-12 flex items-center justify-center" style={{ color: formData.color }}>
                {icons[formData.icon as IconName]}
              </div>
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Número</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="30+ countries"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Etiqueta</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Platforms designed to operate..."
              required
            />
          </div>
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
        <h2 className="text-lg font-bold mb-4">Métricas Actuales ({items.length})</h2>
        
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay métricas todavía</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2" style={{ color: item.color }}>
                    {icons[item.icon as IconName] || icons.globe}
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{item.number}</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <span className="text-xs text-gray-400">Orden: {item.order}</span>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50"
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
