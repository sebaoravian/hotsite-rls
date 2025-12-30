import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update impact item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { label, number, icon, color, order } = body

    const item = await prisma.impactItem.update({
      where: { id },
      data: {
        label,
        number,
        icon,
        color,
        order
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating impact item:', error)
    return NextResponse.json({ error: 'Failed to update impact item' }, { status: 500 })
  }
}

// DELETE impact item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.impactItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting impact item:', error)
    return NextResponse.json({ error: 'Failed to delete impact item' }, { status: 500 })
  }
}
