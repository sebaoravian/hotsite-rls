import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

export async function POST(request: Request) {
  try {
    console.log('POST /api/blog - Starting...')
    const session = await requireAuth()
    console.log('Session:', session)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { title, slug, excerpt, content, mediaType, coverImage, coverVideo, published, seoTitle, seoDescription, seoKeywords, ogImage } = body

    console.log('Creating post with data:', { title, slug, mediaType, coverImage, coverVideo, published, authorId: session.userId })

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        mediaType: mediaType || 'image',
        coverImage: coverImage || null,
        coverVideo: coverVideo || null,
        published,
        publishedAt: published ? new Date() : null,
        authorId: session.userId,
        // SEO fields
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        ogImage: ogImage || null,
      }
    })

    console.log('Post created successfully:', post.id)
    return NextResponse.json(post)
  } catch (error: any) {
    console.error('Error creating post:', error)
    console.error('Error stack:', error.stack)
    console.error('Error message:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '1000')
    const slug = searchParams.get('slug')

    // If slug is provided, return single post
    if (slug) {
      const post = await prisma.post.findFirst({
        where: { slug, published: true },
        include: { author: { select: { name: true, email: true } } }
      })
      return NextResponse.json(post ? [post] : [])
    }

    // Get total count
    const totalPosts = await prisma.post.count({
      where: { published: true }
    })

    // Get paginated posts
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      include: { author: { select: { name: true, email: true } } },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      totalPosts
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
