'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeroData {
  videoUrl: string
  title: string
  description: string
  buttons: Array<{
    label: string
    url: string
    order: number
  }>
}

export default function Hero() {
  const [data, setData] = useState<HeroData | null>(null)

  useEffect(() => {
    fetch('/api/content/hero')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) {
    return (
      <section id="hero" className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </section>
    )
  }

  return (
    <section id="hero" className="min-h-[calc(100vh-72px)] flex items-center relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube.com/embed/${data.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${data.videoUrl}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          title="Background video"
          allow="autoplay; encrypted-media"
          style={{ pointerEvents: 'none' }}
        />
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="max-w-[720px]">
          <h1 className="text-[clamp(40px,6vw,68px)] leading-[1.05] tracking-[-0.02em] mb-6 text-white drop-shadow-lg">
            {data.title}
          </h1>
          <p className="text-lg text-white/95 max-w-[520px] mb-10 drop-shadow-md">
            {data.description}
          </p>
          {data.buttons && data.buttons.length > 0 && (
            <div className="flex gap-4 flex-col sm:flex-row">
              {data.buttons.map((button, index) => (
                <Link 
                  key={button.url}
                  href={button.url} 
                  className={`inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 ${
                    index === 0 
                      ? 'bg-white text-gray-900 hover:bg-[#0066CC] hover:text-white' 
                      : 'border border-white/40 text-white hover:bg-[#0066CC] hover:border-[#0066CC]'
                  }`}
                >
                  {button.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 z-10">
        <span className="text-xs text-white">Scroll</span>
        <span className="text-base animate-bounce text-white">↓</span>
      </div>
    </section>
  )
}
