import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET clients section with logos
export async function GET() {
  try {
    const section = await prisma.clientsSection.findFirst({
      include: {
        clients: {
          where: { published: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!section) {
      return NextResponse.json({ error: 'Clients section not found' }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching clients section:', error)
    return NextResponse.json({ error: 'Failed to fetch clients section' }, { status: 500 })
  }
}

// PUT update clients section (title/description)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { title, description } = body

    const section = await prisma.clientsSection.findFirst()
    if (!section) {
      return NextResponse.json({ error: 'Clients section not found' }, { status: 404 })
    }

    const updated = await prisma.clientsSection.update({
      where: { id: section.id },
      data: { title, description },
      include: {
        clients: {
          where: { published: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating clients section:', error)
    return NextResponse.json({ error: 'Failed to update clients section' }, { status: 500 })
  }
}
