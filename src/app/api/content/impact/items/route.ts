import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all impact items
export async function GET() {
  try {
    const items = await prisma.impactItem.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching impact items:', error)
    return NextResponse.json({ error: 'Failed to fetch impact items' }, { status: 500 })
  }
}

// POST create new impact item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { label, number, icon, color, order } = body

    const section = await prisma.impactSection.findFirst()
    if (!section) {
      return NextResponse.json({ error: 'Impact section not found' }, { status: 404 })
    }

    const item = await prisma.impactItem.create({
      data: {
        label,
        number,
        icon: icon || 'globe',
        color: color || '#1967D2',
        order: order || 0,
        sectionId: section.id
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating impact item:', error)
    return NextResponse.json({ error: 'Failed to create impact item' }, { status: 500 })
  }
}
