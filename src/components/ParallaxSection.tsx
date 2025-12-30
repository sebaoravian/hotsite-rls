'use client'

import { ReactNode } from 'react'

interface StackingSectionProps {
  children: ReactNode
  className?: string
  index?: number
}

export default function StackingSection({ children, className = '', index = 0 }: StackingSectionProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        zIndex: index
      }}
    >
      {children}
    </div>
  )
}
