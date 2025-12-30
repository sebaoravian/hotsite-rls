import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET team section with members
export async function GET() {
  try {
    const section = await prisma.teamSection.findFirst({
      include: {
        members: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!section) {
      return NextResponse.json({ error: 'Team section not found' }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

// PUT update team section
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { title, description } = body

    const section = await prisma.teamSection.findFirst()
    
    if (!section) {
      return NextResponse.json({ error: 'Team section not found' }, { status: 404 })
    }

    const updated = await prisma.teamSection.update({
      where: { id: section.id },
      data: { title, description },
      include: {
        members: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}
