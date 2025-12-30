import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET impact section with items
export async function GET() {
  try {
    const section = await prisma.impactSection.findFirst({
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!section) {
      return NextResponse.json({ error: 'Impact section not found' }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching impact:', error)
    return NextResponse.json({ error: 'Failed to fetch impact' }, { status: 500 })
  }
}

// PUT update impact section
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { title, description } = body

    const section = await prisma.impactSection.findFirst()
    
    if (!section) {
      return NextResponse.json({ error: 'Impact section not found' }, { status: 404 })
    }

    const updated = await prisma.impactSection.update({
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
    console.error('Error updating impact:', error)
    return NextResponse.json({ error: 'Failed to update impact' }, { status: 500 })
  }
}
