import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

// GET - Obtener un post específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Error al obtener el post' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await requireAuth()
    } catch {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { title, slug, excerpt, content, mediaType, coverImage, coverVideo, published } = body

    // Verificar que el post existe
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el slug ya existe en otro post
    if (slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'El slug ya existe en otro post' },
          { status: 400 }
        )
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        mediaType: mediaType || 'image',
        coverImage: mediaType === 'image' ? coverImage : null,
        coverVideo: mediaType === 'video' ? coverVideo : null,
        published: published || false
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el post' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await requireAuth()
    } catch {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el post' },
      { status: 500 }
    )
  }
}
