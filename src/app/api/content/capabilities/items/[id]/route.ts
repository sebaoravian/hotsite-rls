import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update capability item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, icon, color, order } = body

    const item = await prisma.capabilityItem.update({
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
    console.error('Error updating capability item:', error)
    return NextResponse.json({ error: 'Failed to update capability item' }, { status: 500 })
  }
}

// DELETE capability item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.capabilityItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting capability item:', error)
    return NextResponse.json({ error: 'Failed to delete capability item' }, { status: 500 })
  }
}
