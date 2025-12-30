'use client'

import { useEffect, useState } from 'react'

interface ClientLogo {
  id: string
  name: string
  logoUrl: string
  tint?: string | null
}

export default function ClientsSlider() {
  const [logos, setLogos] = useState<ClientLogo[]>([])

  useEffect(() => {
    fetch('/api/content/clients/logos')
      .then(res => res.json())
      .then((data) => setLogos(data))
      .catch(console.error)
  }, [])

  if (logos.length === 0) {
    return (
      <section id="clients" className="pt-16 pb-24 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-6 text-center text-gray-900">Our Clients</h2>
          <p className="text-center text-gray-500">Agrega logos desde el admin.</p>
        </div>
      </section>
    )
  }

  // Duplicate logos to create an infinite scroll effect
  const items = [...logos, ...logos]

  return (
    <section id="clients" className="pt-16 pb-24 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-[-0.02em] mb-12 text-center text-gray-900">Our Clients</h2>
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-[90px] clients-animate-scroll">
            {items.map((logo, idx) => (
              <div key={`${logo.id}-${idx}`} className="h-[154px] flex items-center">
                {logo.tint ? (
                  <div
                    className="h-[154px] w-[205px]"
                    style={{
                      backgroundColor: logo.tint,
                      WebkitMaskImage: `url(${logo.logoUrl})`,
                      maskImage: `url(${logo.logoUrl})`,
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      opacity: 0.8
                    }}
                    aria-label={logo.name}
                  />
                ) : (
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="h-[154px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
