import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update team member
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, role, bio, photo, color, order } = body

    console.log('Updating team member:', { id, name, role, bio, photo, color, order })

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        bio,
        photo,
        color,
        order
      }
    })

    console.log('Updated member:', member)
    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

// DELETE team member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.teamMember.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
