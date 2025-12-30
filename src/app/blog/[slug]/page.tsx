import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogPostClient from './BlogPostClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  })

  if (!post || !post.published) {
    return {
      title: 'Post Not Found',
    }
  }

  const seoTitle = post.seoTitle || post.title
  const seoDescription = post.seoDescription || post.excerpt || post.title
  const ogImage = post.ogImage || post.coverImage || '/logo.png'
  const canonicalUrl = post.canonicalUrl || `https://rotom-labs.com/blog/${slug}`

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: post.seoKeywords?.split(',').map(k => k.trim()),
    authors: [{ name: post.author.name || 'RotomLabs Team' }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://rotom-labs.com/blog/${slug}`,
      siteName: 'RotomLabs',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name || 'RotomLabs Team'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      creator: '@rotom_labs',
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  })

  if (!post || !post.published) {
    notFound()
  }

  return <BlogPostClient initialPost={post} />
}
