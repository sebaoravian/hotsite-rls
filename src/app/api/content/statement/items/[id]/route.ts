import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { icon, title, description, color, order } = body

    const item = await prisma.statementItem.update({
      where: { id },
      data: {
        icon,
        title,
        description,
        color,
        order
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating statement item:', error)
    return NextResponse.json({ error: 'Failed to update statement item' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.statementItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting statement item:', error)
    return NextResponse.json({ error: 'Failed to delete statement item' }, { status: 500 })
  }
}
