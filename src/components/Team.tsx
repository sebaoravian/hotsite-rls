'use client'

import { useEffect, useState } from 'react'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo: string
  color: string
  order: number
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const colors = ['#1967D2', '#EA4335', '#FBBC04', '#34A853']

  useEffect(() => {
    fetch('/api/content/team/members')
      .then(res => res.json())
      .then(setMembers)
      .catch(console.error)
  }, [])

  if (members.length === 0) {
    return (
      <section id="team" className="pt-16 pb-24 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-[-0.02em] mb-12 text-center text-gray-900">The Team Behind RotomLabs</h2>
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="team" className="pt-16 pb-24 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-[-0.02em] mb-12 text-center text-gray-900">The Team Behind RotomLabs</h2>
        <p className="text-center text-gray-700 mb-16 max-w-2xl mx-auto">
          A multidisciplinary team combining technical excellence, strategic thinking, and deep industry experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, i) => {
            const color = member.color || colors[i % colors.length]
            return (
              <div 
                key={member.id} 
                className="bg-white rounded-lg p-6 hover:scale-105 transition-transform duration-300"
              >
                {/* Photo */}
                <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden relative group">
                  <div 
                    className="w-full h-full flex items-center justify-center text-white text-6xl font-bold transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                    style={{
                      backgroundColor: color,
                      backgroundImage: `url(${member.photo})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Fallback to color if image doesn't exist */}
                  </div>
                  {/* Glitch overlay effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `repeating-linear-gradient(
                        0deg,
                        ${color}00 0px,
                        ${color}40 1px,
                        ${color}00 2px,
                        ${color}00 3px
                      )`
                    }}
                  />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color }}>{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 font-medium">{member.role}</p>
                  {member.bio && (
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
