import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update principle item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, icon, color, order } = body

    const item = await prisma.principleItem.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        color,
        order
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating principle item:', error)
    return NextResponse.json({ error: 'Failed to update principle item' }, { status: 500 })
  }
}

// DELETE principle item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.principleItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting principle item:', error)
    return NextResponse.json({ error: 'Failed to delete principle item' }, { status: 500 })
  }
}
