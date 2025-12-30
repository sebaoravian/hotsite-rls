'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { trackEvent } from '@/lib/analytics'
import { BlogPostSchema, BreadcrumbSchema } from '@/components/StructuredData'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  mediaType: string
  coverImage: string | null
  coverVideo: string | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  published: boolean
  seoDescription: string | null
  author: {
    name: string | null
    email: string
  }
}

interface Props {
  initialPost: Post
}

export default function BlogPostClient({ initialPost }: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const post = initialPost

  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0)
    
    // Trigger slide in animation
    setIsVisible(true)
    
    // Track blog post view
    trackEvent.blogPostView(post.title, post.slug)
  }, [post])

  const breadcrumbItems = [
    { name: 'Home', url: 'https://rotom-labs.com' },
    { name: 'Blog', url: 'https://rotom-labs.com/blog' },
    { name: post.title, url: `https://rotom-labs.com/blog/${post.slug}` },
  ]

  return (
    <>
      <BlogPostSchema
        title={post.title}
        description={post.seoDescription || post.excerpt || post.title}
        slug={post.slug}
        publishedAt={post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt)}
        updatedAt={new Date(post.updatedAt)}
        coverImage={post.coverImage || undefined}
        author={post.author}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Navbar />
      <div className={`min-h-screen bg-white pt-[72px] transition-transform duration-700 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <main className="max-w-[900px] mx-auto px-6 py-16">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-semibold mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{post.author.name || post.author.email}</span>
                <span>•</span>
                <time dateTime={post.publishedAt?.toString() || post.createdAt.toString()}>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                </time>
              </div>
            </header>

            {/* Cover Media */}
            {post.mediaType === 'video' && post.coverVideo ? (
              <div className="mb-12 rounded-lg overflow-hidden aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${post.coverVideo}?autoplay=0&controls=1&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={post.title}
                />
              </div>
            ) : post.coverImage ? (
              <div className="mb-12 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : null}

            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 leading-relaxed text-gray-800">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="text-sm text-gray-600 hover:text-black hover:underline"
            >
              ← Back to all posts
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
