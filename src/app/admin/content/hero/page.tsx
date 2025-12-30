'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface HeroData {
  id: string
  videoUrl: string
  title: string
  description: string
  buttons: Array<{
    id: string
    label: string
    url: string
    order: number
  }>
}

export default function HeroEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<HeroData | null>(null)
  const [buttons, setButtons] = useState<Array<{id: string, label: string, url: string, order: number}>>([])
  const [editingButtonId, setEditingButtonId] = useState<string | null>(null)
  const [buttonForm, setButtonForm] = useState({
    label: '',
    url: '',
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [heroRes, buttonsRes] = await Promise.all([
        fetch('/api/content/hero'),
        fetch('/api/content/hero/buttons')
      ])
      const heroJson = await heroRes.json()
      const buttonsJson = await buttonsRes.json()
      setData(heroJson)
      setButtons(buttonsJson)
    } catch (error) {
      console.error('Error fetching hero:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setSaving(true)
    try {
      const res = await fetch('/api/content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert('✅ Hero section actualizada correctamente')
      } else {
        alert('❌ Error al actualizar')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('❌ Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleButtonSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingButtonId) {
        const res = await fetch(`/api/content/hero/buttons/${editingButtonId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buttonForm)
        })
        if (res.ok) {
          alert('✅ Botón actualizado')
          setEditingButtonId(null)
          resetButtonForm()
          fetchData()
        }
      } else {
        const res = await fetch('/api/content/hero/buttons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buttonForm)
        })
        if (res.ok) {
          alert('✅ Botón creado')
          resetButtonForm()
          fetchData()
        }
      }
    } catch (error) {
      console.error('Error saving button:', error)
      alert('❌ Error al guardar botón')
    }
  }

  const handleEditButton = (button: {id: string, label: string, url: string, order: number}) => {
    setEditingButtonId(button.id)
    setButtonForm({
      label: button.label,
      url: button.url,
      order: button.order
    })
  }

  const handleDeleteButton = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este botón?')) return
    try {
      const res = await fetch(`/api/content/hero/buttons/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('✅ Botón eliminado')
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting button:', error)
      alert('❌ Error al eliminar')
    }
  }

  const resetButtonForm = () => {
    setButtonForm({
      label: '',
      url: '',
      order: buttons.length
    })
  }

  const cancelEditButton = () => {
    setEditingButtonId(null)
    resetButtonForm()
  }

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>
  }

  if (!data) {
    return <div className="text-center py-12">No se encontraron datos</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hero Section</h1>
          <p className="text-gray-600">Edita el video, título, descripción y botones principales</p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Video ID de YouTube
              <span className="text-gray-500 font-normal ml-2">(solo el ID, ej: xdCPEZGSVt0)</span>
            </label>
            <input
              type="text"
              value={data.videoUrl}
              onChange={(e) => setData({ ...data, videoUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="xdCPEZGSVt0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Título Principal</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>

      {/* Buttons Management */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Botones del Hero</h2>
        
        {/* Button Form */}
        <form onSubmit={handleButtonSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-bold mb-3">
            {editingButtonId ? 'Editar Botón' : 'Nuevo Botón'}
          </h3>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1">Texto del botón</label>
              <input
                type="text"
                value={buttonForm.label}
                onChange={(e) => setButtonForm({ ...buttonForm, label: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Explore capabilities"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">URL o anchor</label>
              <input
                type="text"
                value={buttonForm.url}
                onChange={(e) => setButtonForm({ ...buttonForm, url: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="#capabilities"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">Orden</label>
              <input
                type="number"
                value={buttonForm.order}
                onChange={(e) => setButtonForm({ ...buttonForm, order: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-black text-white rounded-lg font-medium hover:bg-gray-800"
            >
              {editingButtonId ? 'Actualizar' : 'Crear'}
            </button>
            {editingButtonId && (
              <button
                type="button"
                onClick={cancelEditButton}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Buttons List */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold mb-2">Botones Actuales ({buttons.length})</h3>
          {buttons.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No hay botones todavía</p>
          ) : (
            buttons.map((button) => (
              <div
                key={button.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{button.label}</div>
                  <div className="text-xs text-gray-500">
                    {button.url} · Orden: {button.order}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditButton(button)}
                    className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteButton(button.id)}
                    className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
