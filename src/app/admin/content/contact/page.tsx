'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ContactData {
  id: string
  mainTitle: string
  mainDesc: string
  formTitle: string
  formDesc: string
  emailTo: string
}

export default function ContactEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<ContactData | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/contact')
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error('Error fetching contact:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setSaving(true)
    try {
      const res = await fetch('/api/content/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert('✅ Configuración de contacto actualizada')
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
          <h1 className="text-3xl font-bold mb-2">Contact Section</h1>
          <p className="text-gray-600">Configura los textos del formulario de contacto</p>
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
          <div className="pb-6 border-b">
            <h2 className="text-lg font-bold mb-4">Sección Principal</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Título Principal
                <span className="text-gray-500 font-normal ml-2">(ej: "Let's build what's next")</span>
              </label>
              <input
                type="text"
                value={data.mainTitle}
                onChange={(e) => setData({ ...data, mainTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción Principal
                <span className="text-gray-500 font-normal ml-2">(texto descriptivo del servicio)</span>
              </label>
              <textarea
                value={data.mainDesc}
                onChange={(e) => setData({ ...data, mainDesc: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="If you're planning, scaling or re-architecting a digital ecosystem..."
              />
            </div>
          </div>

          <div className="pb-6 border-b">
            <h2 className="text-lg font-bold mb-4">Formulario</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Título del Formulario
                <span className="text-gray-500 font-normal ml-2">(ej: "Get in touch")</span>
              </label>
              <input
                type="text"
                value={data.formTitle}
                onChange={(e) => setData({ ...data, formTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción del Formulario
                <span className="text-gray-500 font-normal ml-2">(mensaje de invitación)</span>
              </label>
              <textarea
                value={data.formDesc}
                onChange={(e) => setData({ ...data, formDesc: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Ready to start a project or need strategic guidance? Reach out..."
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Notificaciones</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Emails de Notificación
                <span className="text-gray-500 font-normal ml-2">(separados por comas para múltiples destinatarios)</span>
              </label>
              <input
                type="text"
                value={data.emailTo}
                onChange={(e) => setData({ ...data, emailTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="contact@rotom-labs.com, admin@rotom-labs.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Los mensajes del formulario se enviarán a estos emails. Usa comas para separar múltiples destinatarios.
              </p>
            </div>
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

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Nota:</strong> Las oficinas se gestionan en la sección "Offices". El envío automático de emails se implementará próximamente.
        </p>
      </div>
    </div>
  )
}
