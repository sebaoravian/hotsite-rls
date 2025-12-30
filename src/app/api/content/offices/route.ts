import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const offices = await prisma.office.findMany({
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(offices)
  } catch (error) {
    console.error('Error fetching offices:', error)
    return NextResponse.json({ error: 'Failed to fetch offices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const office = await prisma.office.create({
      data: {
        code: data.code,
        address: data.address,
        email: data.email,
        order: data.order
      }
    })
    
    return NextResponse.json(office)
  } catch (error) {
    console.error('Error creating office:', error)
    return NextResponse.json({ error: 'Failed to create office' }, { status: 500 })
  }
}
