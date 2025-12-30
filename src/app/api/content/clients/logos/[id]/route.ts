import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update a client logo
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, logoUrl, order, published, tint } = body

    const updated = await prisma.clientLogo.update({
      where: { id },
      data: {
        name,
        logoUrl,
        order: typeof order === 'number' ? order : undefined,
        published: typeof published === 'boolean' ? published : undefined,
        tint: typeof tint === 'string' ? tint : undefined
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating client logo:', error)
    return NextResponse.json({ error: 'Failed to update client logo' }, { status: 500 })
  }
}

// DELETE a client logo
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.clientLogo.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting client logo:', error)
    return NextResponse.json({ error: 'Failed to delete client logo' }, { status: 500 })
  }
}
