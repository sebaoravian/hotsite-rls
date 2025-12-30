'use client'

import { useEffect, useState, useRef } from 'react'

export default function ParallaxSeparator({ inverted = false }: { inverted?: boolean }) {
  const [scrollY, setScrollY] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const elementCenter = rect.top + rect.height / 2
        const viewportCenter = window.innerHeight / 2
        const distance = elementCenter - viewportCenter
        setOffsetY(distance)
      }
      setScrollY(window.scrollY)
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={ref} className="relative h-80 -my-40 pointer-events-none">
      {/* Background solid color that moves */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${-offsetY * 0.2}px)`,
          backgroundColor: inverted ? '#ffffff' : '#0066CC'
        }}
      />
      
      {/* Wave layer 1 - smooth curves */}
      <svg 
        className="absolute inset-0 w-full h-full z-10" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 320"
        style={{
          transform: `translateY(${-offsetY * 0.4}px)`
        }}
      >
        <path 
          d="M0,160 Q360,100 720,160 T1440,160 L1440,320 L0,320 Z" 
          fill={inverted ? '#0066CC' : '#ffffff'}
          opacity="0.6"
        />
      </svg>

      {/* Wave layer 2 */}
      <svg 
        className="absolute inset-0 w-full h-full z-20" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 320"
        style={{
          transform: `translateY(${-offsetY * 0.6}px)`
        }}
      >
        <path 
          d="M0,192 Q360,128 720,192 T1440,192 L1440,320 L0,320 Z" 
          fill={inverted ? '#0066CC' : '#ffffff'}
          opacity="0.5"
        />
      </svg>

      {/* Wave layer 3 - fastest */}
      <svg 
        className="absolute inset-0 w-full h-full z-30" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 320"
        style={{
          transform: `translateY(${-offsetY * 0.8}px)`
        }}
      >
        <path 
          d="M0,224 Q360,160 720,224 T1440,224 L1440,320 L0,320 Z" 
          fill={inverted ? '#0066CC' : '#ffffff'}
          opacity="0.4"
        />
      </svg>
    </div>
  )
}
