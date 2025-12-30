'use client'

import React, { useEffect, useState } from 'react'

interface ServiceItem {
  id: string
  title: string
  description: string
  mockupUrl: string
  order: number
}

function Services() {
  const [items, setItems] = useState<ServiceItem[]>([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  useEffect(() => {
    fetch('/api/content/services/items')
      .then(res => res.json())
      .then((data: ServiceItem[]) => {
        const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setItems(sorted)
      })
      .catch(console.error)
  }, [])

  const prev = () => {
    setDirection('left')
    setIndex((i) => (i - 1 + items.length) % items.length)
  }
  const next = () => {
    setDirection('right')
    setIndex((i) => (i + 1) % items.length)
  }

  const current = items[index]

  return (
    <section id="services" className="pt-16 pb-24 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[720px] mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-4 text-gray-900">Our Services</h2>
          <p className="text-base text-gray-600 leading-relaxed">A more colloquial walkthrough of our main capabilities.</p>
        </div>

        {items.length > 0 ? (
          <div className={direction === 'right' ? 'animate-enter-right' : 'animate-enter-left'}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="relative p-4 md:p-6 md:pl-12 flex items-center justify-center">
                <button onClick={prev} aria-label="Previous" className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 text-gray-700 hover:text-black">
                  {/* Left arrow */}
                  <span className="sr-only">Previous</span>
                  &#8592;
                </button>
                <img src={current.mockupUrl} alt={current.title} className="max-h-[420px] max-w-full object-contain" />
              </div>

              <div className="relative p-4 md:p-6 md:pr-12">
                <div className="max-w-[560px]">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{current.title}</h3>
                  <p className="text-base text-gray-700 leading-relaxed">{current.description}</p>
                </div>
                <button onClick={next} aria-label="Next" className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 text-gray-700 hover:text-black">
                  {/* Right arrow */}
                  <span className="sr-only">Next</span>
                  &#8594;
                </button>
              </div>
            </div>

            {/* Mobile arrows */}
            <button onClick={prev} aria-label="Previous" className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 text-gray-700 hover:text-black">
              <span className="sr-only">Previous</span>
              &#8592;
            </button>
            <button onClick={next} aria-label="Next" className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 text-gray-700 hover:text-black">
              <span className="sr-only">Next</span>
              &#8594;
            </button>

            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? 'true' : undefined}
                  className={`rounded-full transition-all ${i === index ? 'w-8 h-3 bg-black' : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading...</div>
        )}
      </div>
    </section>
  )
}

export default Services
