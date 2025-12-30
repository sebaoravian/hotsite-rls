import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/content/footer - Obtener configuración del footer
export async function GET() {
  try {
    let footer = await prisma.footerSettings.findFirst({
      include: {
        socialLinks: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // Si no existe, crear uno por defecto
    if (!footer) {
      footer = await prisma.footerSettings.create({
        data: {
          copyrightText: 'Copyright 2025',
          socialLinks: {
            create: [
              {
                name: 'LinkedIn',
                url: 'https://linkedin.com/company/rotomlabs',
                icon: 'Linkedin',
                order: 1
              },
              {
                name: 'Instagram',
                url: 'https://instagram.com/rotom_labs',
                icon: 'Instagram',
                order: 2
              }
            ]
          }
        },
        include: {
          socialLinks: {
            orderBy: { order: 'asc' }
          }
        }
      })
    }
    
    return NextResponse.json(footer)
  } catch (error) {
    console.error('Error fetching footer settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer settings' },
      { status: 500 }
    )
  }
}

// PUT /api/content/footer - Actualizar footer
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { copyrightText } = body

    let footer = await prisma.footerSettings.findFirst()

    if (!footer) {
      footer = await prisma.footerSettings.create({
        data: { copyrightText }
      })
    } else {
      footer = await prisma.footerSettings.update({
        where: { id: footer.id },
        data: { copyrightText }
      })
    }

    return NextResponse.json(footer)
  } catch (error) {
    console.error('Error updating footer:', error)
    return NextResponse.json(
      { error: 'Failed to update footer' },
      { status: 500 }
    )
  }
}
