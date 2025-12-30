import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all principle items
export async function GET() {
  try {
    const items = await prisma.principleItem.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching principle items:', error)
    return NextResponse.json({ error: 'Failed to fetch principle items' }, { status: 500 })
  }
}

// POST create new principle item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, icon, color, order } = body

    const section = await prisma.principlesSection.findFirst()
    if (!section) {
      return NextResponse.json({ error: 'Principles section not found' }, { status: 404 })
    }

    const item = await prisma.principleItem.create({
      data: {
        title,
        description,
        icon: icon || 'check',
        color: color || '#1967D2',
        order: order || 0,
        sectionId: section.id
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating principle item:', error)
    return NextResponse.json({ error: 'Failed to create principle item' }, { status: 500 })
  }
}
