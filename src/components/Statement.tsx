'use client'

import { useEffect, useState } from 'react'

interface StatementData {
  title: string
  description: string
  videoUrl: string
}

export default function Statement() {
  const [data, setData] = useState<StatementData | null>(null)

  useEffect(() => {
    fetch('/api/content/statement')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) {
    return (
      <section id="statement" className="pt-16 pb-8 text-center scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-gray-500">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="statement" className="pt-16 pb-8 text-center scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[clamp(28px,4vw,48px)] mb-4 tracking-[-0.01em] text-gray-900">
          {data.title}
        </h2>
        <p className="max-w-[800px] mx-auto text-base text-gray-700 leading-relaxed mb-8">
          {data.description}
        </p>
        
        {/* Video */}
        {data.videoUrl && (
          <div className="max-w-[800px] mx-auto mt-8">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                src={`https://www.youtube.com/embed/${data.videoUrl}?modestbranding=1&rel=0&showinfo=0`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
