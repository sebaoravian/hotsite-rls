import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all client logos (published)
export async function GET() {
  try {
    const logos = await prisma.clientLogo.findMany({
      where: { published: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(logos)
  } catch (error) {
    console.error('Error fetching client logos:', error)
    return NextResponse.json({ error: 'Failed to fetch client logos' }, { status: 500 })
  }
}

// POST create new client logo
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, logoUrl, order, published, tint } = body

    const section = await prisma.clientsSection.findFirst()
    if (!section) {
      return NextResponse.json({ error: 'Clients section not found' }, { status: 404 })
    }

    const logo = await prisma.clientLogo.create({
      data: {
        name,
        logoUrl,
        order: typeof order === 'number' ? order : 0,
        published: typeof published === 'boolean' ? published : true,
        tint: tint || null,
        sectionId: section.id
      }
    })

    return NextResponse.json(logo)
  } catch (error) {
    console.error('Error creating client logo:', error)
    return NextResponse.json({ error: 'Failed to create client logo' }, { status: 500 })
  }
}
