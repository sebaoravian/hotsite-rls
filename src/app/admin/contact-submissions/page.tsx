'use client'

import { useEffect, useState } from 'react'

interface ContactSubmission {
  id: string
  name: string
  company: string
  email: string
  message: string
  status: string
  notes: string | null
  utm_campaign?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_term?: string | null
  utm_content?: string | null
  createdAt: string
}

const statusLabels: Record<string, string> = {
  NEW: 'Nuevo',
  CONTACTED: 'Contactado',
  QUALIFIED: 'Calificado',
  PROPOSAL: 'Propuesta',
  NEGOTIATION: 'Negociación',
  WON: 'Ganado',
  LOST: 'Perdido',
  ON_HOLD: 'En pausa',
  SPAM: 'Basura'
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-purple-100 text-purple-800',
  QUALIFIED: 'bg-green-100 text-green-800',
  PROPOSAL: 'bg-yellow-100 text-yellow-800',
  NEGOTIATION: 'bg-orange-100 text-orange-800',
  WON: 'bg-green-600 text-white',
  LOST: 'bg-gray-400 text-white',
  ON_HOLD: 'bg-gray-200 text-gray-700',
  SPAM: 'bg-red-600 text-white'
}

// Definición de leads buenos vs malos
const goodLeadStatuses = ['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON']
const badLeadStatuses = ['LOST', 'SPAM']

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [metrics, setMetrics] = useState({
    total: 0,
    good: 0,
    bad: 0,
    pending: 0,
    conversionRate: 0
  })

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/contact/submissions')
      const data = await response.json()
      setSubmissions(data)
      
      // Calcular métricas
      const total = data.length
      const good = data.filter((s: ContactSubmission) => goodLeadStatuses.includes(s.status)).length
      const bad = data.filter((s: ContactSubmission) => badLeadStatuses.includes(s.status)).length
      const pending = data.filter((s: ContactSubmission) => !goodLeadStatuses.includes(s.status) && !badLeadStatuses.includes(s.status)).length
      const conversionRate = total > 0 ? Math.round((good / total) * 100) : 0
      
      setMetrics({ total, good, bad, pending, conversionRate })
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este envío?')) return

    try {
      const response = await fetch(`/api/contact/submissions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSubmissions()
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
    }
  }

  const startEdit = (submission: ContactSubmission) => {
    setEditingId(submission.id)
    setEditStatus(submission.status)
    setEditNotes(submission.notes || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditStatus('')
    setEditNotes('')
  }

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes,
        }),
      })

      if (response.ok) {
        fetchSubmissions()
        cancelEdit()
      }
    } catch (error) {
      console.error('Error updating submission:', error)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const submission = submissions.find(s => s.id === id)
      const response = await fetch(`/api/contact/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: submission?.notes || '',
        }),
      })

      if (response.ok) {
        fetchSubmissions()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Envíos del Formulario de Contacto</h1>

      {/* Métricas del Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Leads</p>
          <p className="text-3xl font-bold">{metrics.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 mb-1">Leads Buenos</p>
          <p className="text-3xl font-bold text-green-700">{metrics.good}</p>
          <p className="text-xs text-green-600 mt-1">Calificados, Propuesta, Negociación, Ganados</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-700 mb-1">Leads Malos</p>
          <p className="text-3xl font-bold text-red-700">{metrics.bad}</p>
          <p className="text-xs text-red-600 mt-1">Perdidos y Basura</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-blue-700">{metrics.pending}</p>
          <p className="text-xs text-blue-600 mt-1">Nuevos, Contactados, En Pausa</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 mb-1">Tasa Conversión</p>
          <p className="text-3xl font-bold text-purple-700">{metrics.conversionRate}%</p>
          <p className="text-xs text-purple-600 mt-1">Buenos / Total</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <p className="text-gray-500">No hay envíos todavía.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{submission.name}</h3>
                    <select
                      value={submission.status}
                      onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[submission.status]}`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-gray-600">{submission.email}</p>
                  {submission.company && (
                    <p className="text-sm text-gray-500">{submission.company}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(submission.createdAt).toLocaleString('es-ES')}
                  </span>
                  {editingId !== submission.id && (
                    <button
                      onClick={() => startEdit(submission)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => deleteSubmission(submission.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Mensaje:</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{submission.message}</p>
              </div>

              {/* Información de Campaña UTM */}
              {(submission.utm_campaign || submission.utm_source || submission.utm_medium) && (
                <div className="bg-green-50 border border-green-200 p-3 rounded mb-3">
                  <p className="text-xs font-semibold text-green-800 mb-2 uppercase">📊 Origen de la campaña</p>
                  <div className="flex flex-wrap gap-2">
                    {submission.utm_campaign && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-mono">
                        utm_campaign={submission.utm_campaign}
                      </span>
                    )}
                    {submission.utm_source && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-mono">
                        utm_source={submission.utm_source}
                      </span>
                    )}
                    {submission.utm_medium && (
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-mono">
                        utm_medium={submission.utm_medium}
                      </span>
                    )}
                    {submission.utm_term && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-mono">
                        utm_term={submission.utm_term}
                      </span>
                    )}
                    {submission.utm_content && (
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-mono">
                        utm_content={submission.utm_content}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {editingId === submission.id ? (
                <div className="bg-blue-50 p-4 rounded space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas internas
                    </label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm min-h-[80px]"
                      placeholder="Agregar notas sobre el seguimiento..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(submission.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                submission.notes && (
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="text-xs font-medium text-gray-700 mb-1">Notas:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{submission.notes}</p>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
