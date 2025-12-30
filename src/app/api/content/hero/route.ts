import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst({
      include: {
        buttons: {
          orderBy: { order: 'asc' }
        }
      }
    })
    
    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error fetching hero:', error)
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    const hero = await prisma.heroSection.update({
      where: { id: data.id },
      data: {
        videoUrl: data.videoUrl,
        title: data.title,
        description: data.description
      },
      include: {
        buttons: {
          orderBy: { order: 'asc' }
        }
      }
    })
    
    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error updating hero:', error)
    return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 })
  }
}
