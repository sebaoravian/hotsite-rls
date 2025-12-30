import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      company, 
      email, 
      message,
      utm_campaign,
      utm_source,
      utm_medium,
      utm_term,
      utm_content
    } = body

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Guardar el envío en la base de datos con parámetros UTM
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        company: company || '',
        email,
        message,
        // Guardar parámetros UTM si están presentes
        utm_campaign: utm_campaign || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
      },
    })

    // TODO: Aquí podrías agregar envío de email a las direcciones configuradas
    // const contactSection = await prisma.contactSection.findFirst()
    // const emailTo = contactSection?.emailTo || ''
    // Enviar notificación por email...

    return NextResponse.json(
      { success: true, submission },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
