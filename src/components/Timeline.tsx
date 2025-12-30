'use client'

import { useEffect, useRef, useState } from 'react'

interface TimelineItem {
  id: string
  year: number
  title: string
  description: string
  color: string
}

export default function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [milestones, setMilestones] = useState<TimelineItem[]>([])

  useEffect(() => {
    fetch('/api/content/timeline')
      .then(res => res.json())
      .then(setMilestones)
      .catch(console.error)
  }, [])

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement && milestones.length > 0) {
      // Scroll to the end (last item) on mount
      setTimeout(() => {
        scrollElement.scrollLeft = scrollElement.scrollWidth
        checkScroll()
      }, 100)
      
      scrollElement.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        scrollElement.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [milestones])

  if (milestones.length === 0) {
    return (
      <section id="timeline" className="pt-16 pb-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-12 text-center text-gray-900">Our Journey</h2>
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="timeline" className="pt-16 pb-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-[-0.02em] mb-12 text-center text-gray-900">Our Journey</h2>
      </div>

      <div className="relative">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-100 shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-100 shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Timeline container */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto pb-8 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex min-w-max justify-center px-6 gap-4">
            {milestones.map((milestone) => (
                <div key={milestone.id} className="relative flex flex-col items-center" style={{ width: '280px' }}>
                  {/* Timeline dot and line */}
                  <div className="relative flex items-center w-full mb-6">
                    {/* Line before - extends beyond card edge */}
                    {milestones.indexOf(milestone) > 0 && (
                      <div className="absolute -left-2 right-1/2 h-0.5 bg-gray-300"></div>
                    )}
                    
                    {/* Dot - always centered */}
                    <div className="relative z-10 flex items-center justify-center w-full">
                      <div className="w-4 h-4 bg-white rounded-full border-4 border-[#0066CC] shadow-sm"></div>
                    </div>
                    
                    {/* Line after - extends beyond card edge */}
                    {milestones.indexOf(milestone) < milestones.length - 1 && (
                      <div className="absolute left-1/2 -right-2 h-0.5 bg-gray-300"></div>
                    )}
                  </div>

                  {/* Content card */}
                  <div className="bg-white rounded-lg p-6 w-full text-center shadow-sm hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold mb-2" style={{ color: milestone.color }}>{milestone.year}</div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
