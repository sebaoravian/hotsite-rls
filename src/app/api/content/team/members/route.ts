import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all team members
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

// POST create new team member
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, bio, photo, color, order } = body

    const section = await prisma.teamSection.findFirst()
    if (!section) {
      return NextResponse.json({ error: 'Team section not found' }, { status: 404 })
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio: bio || '',
        photo: photo || '/team/placeholder.jpg',
        color: color || '#1967D2',
        order: order || 0,
        teamId: section.id
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
