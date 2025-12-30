'use client'

import { useState, useEffect } from 'react'

interface Office {
  id: string
  code: string
  address: string
  email: string
  order: number
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [utmParams, setUtmParams] = useState({
    utm_campaign: '',
    utm_source: '',
    utm_medium: '',
    utm_term: '',
    utm_content: ''
  })
  const [offices, setOffices] = useState<Office[]>([])

  // Capturar parámetros UTM de la URL y cargar oficinas
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setUtmParams({
        utm_campaign: params.get('utm_campaign') || '',
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_term: params.get('utm_term') || '',
        utm_content: params.get('utm_content') || ''
      })
    }

    // Cargar oficinas desde la API
    fetch('/api/content/offices')
      .then(res => res.json())
      .then(data => setOffices(data))
      .catch(err => console.error('Error loading offices:', err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Combinar datos del formulario con parámetros UTM
      const dataToSend = {
        ...formData,
        ...utmParams
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setSubmitStatus('success')
      // Limpiar el formulario
      setFormData({
        name: '',
        company: '',
        email: '',
        message: ''
      })

      // Resetear el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 scroll-mt-16">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-4 text-gray-900">Let's build what's next.</h2>
          <p className="text-base text-gray-600 max-w-[640px] leading-relaxed">
            If you're planning, scaling or re-architecting a digital ecosystem, we can 
            help you connect infrastructure, data and product into a single coherent strategy.
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold tracking-[-0.02em] mb-4 text-gray-900">Get in touch</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ready to start a project or need strategic guidance? Reach out and let's discuss your needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-[480px]">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1.5 text-xs text-gray-600">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all focus:border-gray-900 focus:shadow-sm focus:bg-gray-50/50"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="company" className="block mb-1.5 text-xs text-gray-600">
                Company
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all focus:border-gray-900 focus:shadow-sm focus:bg-gray-50/50"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1.5 text-xs text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all focus:border-gray-900 focus:shadow-sm focus:bg-gray-50/50"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block mb-1.5 text-xs text-gray-600">
                What do you want to build?
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all focus:border-gray-900 focus:shadow-sm focus:bg-gray-50/50 min-h-[120px] resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-black text-white text-sm font-medium shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Sending...' : 'Start the conversation'}
            </button>

            {/* Mensajes de estado */}
            {submitStatus === 'success' && (
              <p className="mt-4 text-sm text-green-600">
                ✓ Thank you! We'll get back to you soon.
              </p>
            )}
            {submitStatus === 'error' && (
              <p className="mt-4 text-sm text-red-600">
                ✗ There was an error. Please try again.
              </p>
            )}
          </form>
        </div>

        {/* Offices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-12">
          {offices.map((office) => (
            <div key={office.id}>
              <h3 className="text-lg font-bold mb-4 text-gray-900">.{office.code}</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {office.address}
                </p>
                <a href={`mailto:${office.email}`} className="text-sm text-[#0066CC] hover:underline block">
                  {office.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
