import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET services section with items
export async function GET() {
  try {
    const section = await prisma.servicesSection.findFirst({
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!section) {
      return NextResponse.json({ error: 'Services section not found' }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

// PUT update services section
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { title, description } = body

    const section = await prisma.servicesSection.findFirst()
    
    if (!section) {
      return NextResponse.json({ error: 'Services section not found' }, { status: 404 })
    }

    const updated = await prisma.servicesSection.update({
      where: { id: section.id },
      data: { title, description },
      include: {
        items: { orderBy: { order: 'asc' } }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating services:', error)
    return NextResponse.json({ error: 'Failed to update services' }, { status: 500 })
  }
}
