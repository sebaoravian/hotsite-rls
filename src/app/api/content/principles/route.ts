import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET principles section with items
export async function GET() {
  try {
    const section = await prisma.principlesSection.findFirst({
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!section) {
      return NextResponse.json({ error: 'Principles section not found' }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching principles:', error)
    return NextResponse.json({ error: 'Failed to fetch principles' }, { status: 500 })
  }
}

// PUT update principles section
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { title, description } = body

    const section = await prisma.principlesSection.findFirst()
    
    if (!section) {
      return NextResponse.json({ error: 'Principles section not found' }, { status: 404 })
    }

    const updated = await prisma.principlesSection.update({
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
    console.error('Error updating principles:', error)
    return NextResponse.json({ error: 'Failed to update principles' }, { status: 500 })
  }
}
