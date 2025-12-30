import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.statementItem.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching statement items:', error)
    return NextResponse.json({ error: 'Failed to fetch statement items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { icon, title, description, color, order } = body

    // Get the statement section ID
    const statement = await prisma.statementSection.findFirst()
    if (!statement) {
      return NextResponse.json({ error: 'Statement section not found' }, { status: 404 })
    }

    const item = await prisma.statementItem.create({
      data: {
        icon,
        title,
        description,
        color,
        order,
        statementId: statement.id
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating statement item:', error)
    return NextResponse.json({ error: 'Failed to create statement item' }, { status: 500 })
  }
}
