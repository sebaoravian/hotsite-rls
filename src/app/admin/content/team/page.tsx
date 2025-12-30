'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo: string
  color: string
  order: number
}

const colors = ['#1967D2', '#EA4335', '#FBBC04', '#34A853']

export default function TeamPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo: '/team/placeholder.jpg',
    color: colors[0],
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/team/members')
      const json = await res.json()
      setMembers(json)
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        console.log('Sending UPDATE with data:', formData)
        const res = await fetch(`/api/content/team/members/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        console.log('Response status:', res.status)
        const data = await res.json()
        console.log('Response data:', data)

        if (res.ok) {
          alert('✅ Miembro actualizado')
          setEditingId(null)
          resetForm()
          fetchData()
        } else {
          alert('❌ Error: ' + (data.error || 'Error desconocido'))
        }
      } else {
        console.log('Sending CREATE with data:', formData)
        const res = await fetch('/api/content/team/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (res.ok) {
          alert('✅ Miembro creado')
          resetForm()
          fetchData()
        } else {
          const data = await res.json()
          alert('❌ Error: ' + (data.error || 'Error desconocido'))
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('❌ Error al guardar')
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo: member.photo || '/team/placeholder.jpg',
      color: member.color || colors[0],
      order: member.order
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este miembro?')) return

    try {
      const res = await fetch(`/api/content/team/members/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('✅ Miembro eliminado')
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('❌ Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      photo: '/team/placeholder.jpg',
      color: colors[0],
      order: members.length
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
          <h1 className="text-3xl font-bold mb-2">The Team</h1>
          <p className="text-gray-600">Gestiona los miembros del equipo</p>
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
          {editingId ? 'Editar Miembro' : 'Nuevo Miembro'}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rol</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="CEO & Co-Founder"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Breve descripción..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Foto URL
              <span className="text-gray-500 font-normal ml-2">(ruta o URL)</span>
            </label>
            <input
              type="text"
              value={formData.photo || ''}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="/team/name.jpg o https://..."
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
        <h2 className="text-lg font-bold mb-4">Miembros Actuales ({members.length})</h2>
        
        {members.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay miembros todavía</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/team/placeholder.jpg'
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm" style={{ color: member.color }}>{member.role}</p>
                    <span className="text-xs text-gray-500">Orden: {member.order}</span>
                  </div>
                </div>
                
                {member.bio && (
                  <p className="text-xs text-gray-600 mb-3">{member.bio}</p>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
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

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Nota:</strong> Las fotos se cargan desde la carpeta public/team/. Asegúrate de subir las imágenes allí primero. La funcionalidad de upload de archivos se implementará próximamente.
        </p>
      </div>
    </div>
  )
}
