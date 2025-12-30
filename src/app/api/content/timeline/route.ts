import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.timelineItem.findMany({
      orderBy: { year: 'asc' }
    })
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching timeline:', error)
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const item = await prisma.timelineItem.create({
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        color: data.color
      }
    })
    
    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating timeline item:', error)
    return NextResponse.json({ error: 'Failed to create timeline item' }, { status: 500 })
  }
}
