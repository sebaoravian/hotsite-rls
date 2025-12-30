import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contact = await prisma.contactSection.findFirst()
    
    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json({ error: 'Failed to fetch contact section' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    const contact = await prisma.contactSection.update({
      where: { id: data.id },
      data: {
        mainTitle: data.mainTitle,
        mainDesc: data.mainDesc,
        formTitle: data.formTitle,
        formDesc: data.formDesc,
        emailTo: data.emailTo
      }
    })
    
    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Failed to update contact section' }, { status: 500 })
  }
}
