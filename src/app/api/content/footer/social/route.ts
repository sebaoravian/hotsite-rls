import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/content/footer/social - Crear social link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, icon, order, footerId } = body

    const socialLink = await prisma.socialLink.create({
      data: {
        name,
        url,
        icon,
        order,
        footerId
      }
    })

    return NextResponse.json(socialLink)
  } catch (error) {
    console.error('Error creating social link:', error)
    return NextResponse.json(
      { error: 'Failed to create social link' },
      { status: 500 }
    )
  }
}
