import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all capability items
export async function GET() {
  try {
    const items = await prisma.capabilityItem.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching capability items:', error)
    return NextResponse.json({ error: 'Failed to fetch capability items' }, { status: 500 })
  }
}

// POST create new capability item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, icon, color, order } = body

    const section = await prisma.capabilitiesSection.findFirst()
    if (!section) {
      return NextResponse.json({ error: 'Capabilities section not found' }, { status: 404 })
    }

    const item = await prisma.capabilityItem.create({
      data: {
        title,
        description,
        icon: icon || '⚙️',
        color: color || '#1967D2',
        order: order || 0,
        sectionId: section.id
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating capability item:', error)
    return NextResponse.json({ error: 'Failed to create capability item' }, { status: 500 })
  }
}
