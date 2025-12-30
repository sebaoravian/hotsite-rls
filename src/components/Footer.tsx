'use client'

import { useEffect, useState } from 'react'
import * as LucideIcons from 'lucide-react'

interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  order: number
}

interface FooterSettings {
  id: string
  copyrightText: string
  socialLinks: SocialLink[]
}

export default function Footer() {
  const [footer, setFooter] = useState<FooterSettings | null>(null)

  useEffect(() => {
    fetch('/api/content/footer')
      .then(res => res.json())
      .then(data => setFooter(data))
      .catch(err => console.error('Error loading footer settings:', err))
  }, [])

  // Defaults mientras carga
  if (!footer) {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4" />
            <div className="flex items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="RotomLabs" 
                className="h-5 w-auto brightness-0 invert" 
              />
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  const sortedLinks = [...footer.socialLinks].sort((a, b) => a.order - b.order)

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {sortedLinks.map((link) => {
              const IconComponent = (LucideIcons as any)[link.icon] || LucideIcons.Circle
              return (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label={link.name}
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              )
            })}
          </div>

          {/* Logo y Copyright */}
          <div className="flex items-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="RotomLabs" 
              className="h-5 w-auto brightness-0 invert" 
            />
            <span className="text-sm text-gray-400">{footer.copyrightText}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
