import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET capabilities section with items
export async function GET() {
  try {
    const section = await prisma.capabilitiesSection.findFirst({
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!section) {
      return NextResponse.json({ error: 'Capabilities section not found' }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching capabilities:', error)
    return NextResponse.json({ error: 'Failed to fetch capabilities' }, { status: 500 })
  }
}

// PUT update capabilities section
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { title, description } = body

    const section = await prisma.capabilitiesSection.findFirst()
    
    if (!section) {
      return NextResponse.json({ error: 'Capabilities section not found' }, { status: 404 })
    }

    const updated = await prisma.capabilitiesSection.update({
      where: { id: section.id },
      data: { title, description },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating capabilities:', error)
    return NextResponse.json({ error: 'Failed to update capabilities' }, { status: 500 })
  }
}
