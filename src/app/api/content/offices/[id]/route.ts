import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    const office = await prisma.office.update({
      where: { id },
      data: {
        code: data.code,
        address: data.address,
        email: data.email,
        order: data.order
      }
    })
    
    return NextResponse.json(office)
  } catch (error) {
    console.error('Error updating office:', error)
    return NextResponse.json({ error: 'Failed to update office' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    await prisma.office.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting office:', error)
    return NextResponse.json({ error: 'Failed to delete office' }, { status: 500 })
  }
}
