import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update service item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, mockupUrl, order } = body

    const item = await prisma.serviceItem.update({
      where: { id },
      data: {
        title,
        description,
        mockupUrl,
        order
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating service item:', error)
    return NextResponse.json({ error: 'Failed to update service item' }, { status: 500 })
  }
}

// DELETE service item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.serviceItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service item:', error)
    return NextResponse.json({ error: 'Failed to delete service item' }, { status: 500 })
  }
}
