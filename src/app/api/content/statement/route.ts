import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const statement = await prisma.statementSection.findFirst({
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })
    
    return NextResponse.json(statement)
  } catch (error) {
    console.error('Error fetching statement:', error)
    return NextResponse.json({ error: 'Failed to fetch statement section' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    const statement = await prisma.statementSection.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl
      },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })
    
    return NextResponse.json(statement)
  } catch (error) {
    console.error('Error updating statement:', error)
    return NextResponse.json({ error: 'Failed to update statement section' }, { status: 500 })
  }
}
