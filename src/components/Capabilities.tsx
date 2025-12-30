'use client'

import { useEffect, useState } from 'react'
import { icons, IconName } from './icons'

interface CapabilityItem {
  id: string
  title: string
  description: string
  icon: string
  color: string
  order: number
}

export default function Capabilities() {
  const [capabilities, setCapabilities] = useState<CapabilityItem[]>([])

  useEffect(() => {
    fetch('/api/content/capabilities/items')
      .then(res => res.json())
      .then(setCapabilities)
      .catch(console.error)
  }, [])

  if (capabilities.length === 0) {
    return (
      <section id="capabilities" className="pt-16 pb-24 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="capabilities" className="pt-16 pb-24 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[720px] mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-4 text-gray-900">Our Capabilities</h2>
          <p className="text-base text-gray-600 leading-relaxed">
            End-to-end technical capabilities. One strategic partner — from infrastructure and security to data, AI and product delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability) => (
            <div key={capability.id} className="bg-white rounded-lg p-6 shadow-sm hover:scale-105 transition-transform duration-300">
              {/* Icon */}
              <div className="flex justify-center mb-4" style={{ color: capability.color }}>
                {icons[capability.icon as IconName] || icons.default}
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-bold mb-3 text-gray-900 text-center">
                {capability.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-center leading-relaxed" style={{ color: capability.color }}>
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
