import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst()
    if (!hero) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 })
    }

    const buttons = await prisma.heroButton.findMany({
      where: { heroId: hero.id },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(buttons)
  } catch (error) {
    console.error('Error fetching hero buttons:', error)
    return NextResponse.json({ error: 'Failed to fetch hero buttons' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { label, url, order } = body

    const hero = await prisma.heroSection.findFirst()
    if (!hero) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 })
    }

    const button = await prisma.heroButton.create({
      data: {
        label,
        url,
        order,
        heroId: hero.id
      }
    })

    return NextResponse.json(button)
  } catch (error) {
    console.error('Error creating hero button:', error)
    return NextResponse.json({ error: 'Failed to create hero button' }, { status: 500 })
  }
}
