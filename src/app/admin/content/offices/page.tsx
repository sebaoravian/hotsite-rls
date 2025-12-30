'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Office {
  id: string
  code: string
  address: string
  email: string
  order: number
}

export default function OfficesEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [offices, setOffices] = useState<Office[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    address: '',
    email: '',
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/offices')
      const json = await res.json()
      setOffices(json)
    } catch (error) {
      console.error('Error fetching offices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        // Update existing
        const res = await fetch(`/api/content/offices/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Oficina actualizada')
          setEditingId(null)
          resetForm()
          fetchData()
        }
      } else {
        // Create new
        const res = await fetch('/api/content/offices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Oficina creada')
          resetForm()
          fetchData()
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('❌ Error al guardar')
    }
  }

  const handleEdit = (office: Office) => {
    setEditingId(office.id)
    setFormData({
      code: office.code,
      address: office.address,
      email: office.email,
      order: office.order
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta oficina?')) return

    try {
      const res = await fetch(`/api/content/offices/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('✅ Oficina eliminada')
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('❌ Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      address: '',
      email: '',
      order: offices.length
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
          <h1 className="text-3xl font-bold mb-2">Oficinas</h1>
          <p className="text-gray-600">Gestiona las oficinas globales (.BUE, .MAD, .BCN, etc.)</p>
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
          {editingId ? 'Editar Oficina' : 'Nueva Oficina'}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Código
              <span className="text-gray-500 font-normal ml-2">(ej: BUE, MAD, BCN)</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="BUE"
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
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Dirección</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Av. Corrientes 123, CABA"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="bue@rotom-labs.com"
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
        <h2 className="text-lg font-bold mb-4">Oficinas Actuales ({offices.length})</h2>
        
        {offices.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay oficinas todavía</p>
        ) : (
          <div className="space-y-3">
            {offices.map((office) => (
              <div
                key={office.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-gray-900">.{office.code}</span>
                    <span className="text-xs text-gray-500">Orden: {office.order}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{office.address}</p>
                  <p className="text-sm text-gray-500">{office.email}</p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(office)}
                    className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(office.id)}
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
