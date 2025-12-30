import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { label, url, order } = body

    const button = await prisma.heroButton.update({
      where: { id },
      data: {
        label,
        url,
        order
      }
    })

    return NextResponse.json(button)
  } catch (error) {
    console.error('Error updating hero button:', error)
    return NextResponse.json({ error: 'Failed to update hero button' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.heroButton.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting hero button:', error)
    return NextResponse.json({ error: 'Failed to delete hero button' }, { status: 500 })
  }
}
