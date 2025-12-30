'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { icons, IconName } from '@/components/icons'

interface StatementItem {
  id: string
  icon: string
  title: string
  description: string
  color: string
  order: number
}

interface StatementSection {
  id: string
  title: string
  description: string
  videoUrl: string
}

const colors = ['#1967D2', '#EA4335', '#FBBC04', '#34A853']
const iconOptions: IconName[] = ['grid', 'users', 'lightning', 'globe', 'badge', 'cloud', 'shield', 'check']

export default function StatementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<StatementItem[]>([])
  const [section, setSection] = useState<StatementSection | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: '',
    videoUrl: ''
  })
  const [formData, setFormData] = useState({
    icon: 'grid' as IconName,
    title: '',
    description: '',
    color: colors[0],
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [itemsRes, sectionRes] = await Promise.all([
        fetch('/api/content/statement/items'),
        fetch('/api/content/statement')
      ])
      const itemsJson = await itemsRes.json()
      const sectionJson = await sectionRes.json()
      setItems(itemsJson)
      setSection(sectionJson)
      setSectionForm({
        title: sectionJson.title,
        description: sectionJson.description,
        videoUrl: sectionJson.videoUrl
      })
    } catch (error) {
      console.error('Error fetching statement data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/content/statement', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: section?.id || 'statement-1',
          title: sectionForm.title,
          description: sectionForm.description,
          videoUrl: sectionForm.videoUrl
        })
      })
      if (res.ok) {
        alert('✅ Sección actualizada')
        fetchData()
      }
    } catch (error) {
      console.error('Error updating section:', error)
      alert('❌ Error al actualizar sección')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const res = await fetch(`/api/content/statement/items/${editingId}`, {
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
        const res = await fetch('/api/content/statement/items', {
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

  const handleEdit = (item: StatementItem) => {
    setEditingId(item.id)
    setFormData({
      icon: item.icon as IconName,
      title: item.title,
      description: item.description,
      color: item.color,
      order: item.order
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este item?')) return

    try {
      const res = await fetch(`/api/content/statement/items/${id}`, {
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
      icon: 'grid' as IconName,
      title: '',
      description: '',
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
          <h1 className="text-3xl font-bold mb-2">Statement Section</h1>
          <p className="text-gray-600">Gestiona la sección "Simplicity is the ultimate technology" y sus 5 items</p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          ← Volver
        </button>
      </div>

      {/* Section Form */}
      <form onSubmit={handleSectionSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-bold mb-4">Sección Principal</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            value={sectionForm.title}
            onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Simplicity is the ultimate technology."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            value={sectionForm.description}
            onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="We transform operational complexity..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Video URL (YouTube ID)</label>
          <input
            type="text"
            value={sectionForm.videoUrl}
            onChange={(e) => setSectionForm({ ...sectionForm, videoUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="ZAx5TJRHWBA"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Solo el ID del video de YouTube (ej: ZAx5TJRHWBA)
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
        >
          Actualizar Sección
        </button>
      </form>

      {/* Items Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? 'Editar Item' : 'Nuevo Item'}
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
            placeholder="Simplicity through architecture."
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
            placeholder="We believe the most advanced systems..."
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
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0" style={{ color: item.color }}>
                    {icons[item.icon as IconName] || icons.grid}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <span className="text-xs text-gray-500">Orden: {item.order}</span>
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
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
