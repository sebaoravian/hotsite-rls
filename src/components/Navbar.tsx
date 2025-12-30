'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isBlogPage = pathname?.startsWith('/blog')

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    if (isBlogPage) {
      e.preventDefault()
      router.push(`/#${section}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between" style={{ marginTop: '1.5px' }}>
        <Link href="/" className="flex items-center gap-2 -mt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.png" 
            alt="RotomLabs" 
            className="h-7 w-auto" 
          />
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm text-gray-600 items-center">
          <Link 
            href="#statement" 
            onClick={(e) => handleNavClick(e, 'statement')}
            className="relative pb-1 hover-underline transition-colors hover:text-black"
          >
            About
          </Link>
          <Link 
            href="#capabilities" 
            onClick={(e) => handleNavClick(e, 'capabilities')}
            className="relative pb-1 hover-underline transition-colors hover:text-black"
          >
            Capabilities
          </Link>
          <Link 
            href="#team" 
            onClick={(e) => handleNavClick(e, 'team')}
            className="relative pb-1 hover-underline transition-colors hover:text-black"
          >
            Team
          </Link>
          <Link 
            href="#contact" 
            onClick={(e) => handleNavClick(e, 'contact')}
            className="relative pb-1 hover-underline transition-colors hover:text-black"
          >
            Contact
          </Link>
          <Link 
            href="/blog" 
            className={`relative pb-1 hover-underline transition-colors hover:text-black ${
              isBlogPage ? 'text-black font-medium' : ''
            }`}
          >
            Blog
          </Link>
          <a 
            href="https://backoffice.dev-env.rotomlabs-apps.com/admin/login" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#0066CC] text-white rounded-full font-medium hover:bg-[#0052a3] transition-colors"
          >
            Client Access
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2 text-sm">
            <button className="px-2 py-1 rounded hover:bg-gray-100 transition-colors font-medium text-black">
              EN
            </button>
            <span className="text-gray-300">|</span>
            <button className="px-2 py-1 rounded hover:bg-gray-100 transition-colors text-gray-600">
              ES
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
