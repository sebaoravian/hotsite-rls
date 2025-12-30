import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        message: data.message
      }
    })
    
    // TODO: Enviar email al emailTo configurado en ContactSection
    
    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}
