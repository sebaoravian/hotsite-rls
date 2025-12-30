'use client'

import { useEffect, useRef, useState } from 'react'
import { icons, IconName } from './icons'

interface PrincipleItem {
  id: string
  icon: string
  title: string
  description: string
  color: string
  order: number
}

export default function Principles() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [principles, setPrinciples] = useState<PrincipleItem[]>([])

  useEffect(() => {
    fetch('/api/content/principles/items')
      .then(res => res.json())
      .then(setPrinciples)
      .catch(console.error)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.9
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (principles.length === 0) {
    return (
      <section id="principles" className="pt-16 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-12 text-center text-gray-900">Our Principles</h2>
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="principles" className="pt-16 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 mb-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-4 text-gray-900">Our Principles</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            We build technology with a set of principles that guide everything we architect and deliver.
          </p>
        </div>
      </div>

      {/* Scrollable cards container - full width */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 justify-start min-w-full px-6">
          {principles.map((principle) => (
            <div 
              key={principle.id}
              className="flex-shrink-0 w-[min(80vw,320px)] snap-center"
            >
              <div className="bg-white rounded-lg p-6 h-full hover:scale-105 transition-transform duration-300 shadow-sm">
                {/* Icon */}
                <div className="flex justify-center mb-4" style={{ color: principle.color }}>
                  {icons[principle.icon as IconName] || icons.default}
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  {principle.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-center leading-relaxed" style={{ color: principle.color }}>
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
