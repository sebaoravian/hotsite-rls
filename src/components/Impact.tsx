'use client'

import { useEffect, useState } from 'react'
import { icons, IconName } from './icons'

interface ImpactItem {
  id: string
  label: string
  number: string
  icon: string
  color: string
  order: number
}

export default function Impact() {
  const [impacts, setImpacts] = useState<ImpactItem[]>([])

  useEffect(() => {
    fetch('/api/content/impact/items')
      .then(res => res.json())
      .then(setImpacts)
      .catch(console.error)
  }, [])

  if (impacts.length === 0) {
    return (
      <section id="impact" className="pt-16 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-4 text-center text-gray-900">Impact</h2>
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="impact" className="pt-16 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-4 text-gray-900">Impact</h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-[800px] mx-auto">
            What we build today is already running at scale in demanding environments. 
            Our platforms serve thousands of users daily across multiple regions, built with the same rigor 
            and standards we bring to every project—from infrastructure to user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((impact) => (
            <div 
              key={impact.id} 
              className="bg-white rounded-lg p-6 shadow-sm hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0" style={{ color: impact.color }}>
                  {icons[impact.icon as IconName] || icons.default}
                </div>
                <div className="flex-1">
                  <div className="text-xl font-semibold mb-2 text-gray-900">{impact.number}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{impact.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
