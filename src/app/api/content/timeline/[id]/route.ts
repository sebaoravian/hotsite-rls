import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    
    const item = await prisma.timelineItem.update({
      where: { id },
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        color: data.color
      }
    })
    
    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating timeline item:', error)
    return NextResponse.json({ error: 'Failed to update timeline item' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await prisma.timelineItem.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting timeline item:', error)
    return NextResponse.json({ error: 'Failed to delete timeline item' }, { status: 500 })
  }
}
