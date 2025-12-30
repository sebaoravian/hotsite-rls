'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ContactSubmission {
  id: string
  name: string
  company: string
  email: string
  message: string
  createdAt: string
  read: boolean
}

export default function SubmissionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/submissions')
      const json = await res.json()
      setSubmissions(json)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const selectedSubmission = submissions.find(s => s.id === selectedId)

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Formularios de Contacto</h1>
          <p className="text-gray-600">Mensajes recibidos del sitio web</p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          ← Volver
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* List */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold">
                Mensajes ({submissions.length})
              </h2>
            </div>
            
            {submissions.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">No hay mensajes todavía</p>
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                {submissions.map((submission) => (
                  <button
                    key={submission.id}
                    onClick={() => setSelectedId(submission.id)}
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${
                      selectedId === submission.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm">{submission.name}</h3>
                      {!submission.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{submission.company}</p>
                    <p className="text-xs text-gray-500">{formatDate(submission.createdAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="col-span-2">
          {selectedSubmission ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedSubmission.name}</h2>
                    <p className="text-gray-600">{selectedSubmission.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedSubmission.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Email: </span>
                    <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-3">Mensaje:</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.message}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t flex gap-3">
                <a
                  href={`mailto:${selectedSubmission.email}?subject=Re: Contacto desde rotom-labs.com`}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                >
                  Responder por Email
                </a>
                <button
                  onClick={() => setSelectedId(null)}
                  className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">Selecciona un mensaje de la lista para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
