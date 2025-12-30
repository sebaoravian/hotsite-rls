import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all service items
export async function GET() {
  try {
    const items = await prisma.serviceItem.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching service items:', error)
    return NextResponse.json({ error: 'Failed to fetch service items' }, { status: 500 })
  }
}

// POST create new service item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, mockupUrl, order } = body

    const section = await prisma.servicesSection.findFirst()
    if (!section) {
      return NextResponse.json({ error: 'Services section not found' }, { status: 404 })
    }

    const item = await prisma.serviceItem.create({
      data: {
        title,
        description,
        mockupUrl,
        order: order ?? 0,
        sectionId: section.id
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating service item:', error)
    return NextResponse.json({ error: 'Failed to create service item' }, { status: 500 })
  }
}
