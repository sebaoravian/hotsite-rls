'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { trackEvent } from '@/lib/analytics'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  mediaType: string
  coverImage: string | null
  coverVideo: string | null
  publishedAt: Date | null
  createdAt: Date
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const postsPerPage = 20

  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0)
    
    // Trigger slide in animation
    setIsVisible(true)
    
    loadPosts(1)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return

      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Load more when user is 500px from bottom
      if (scrollTop + windowHeight >= documentHeight - 500) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMore, currentPage])

  const loadPosts = (page: number) => {
    setLoading(true)
    fetch(`/api/blog?page=${page}&limit=${postsPerPage}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts.filter((post: Post) => post.publishedAt))
        setCurrentPage(page)
        setHasMore(page < data.totalPages)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    const nextPage = currentPage + 1
    
    fetch(`/api/blog?page=${nextPage}&limit=${postsPerPage}`)
      .then(res => res.json())
      .then(data => {
        const newPosts = data.posts.filter((post: Post) => post.publishedAt)
        setPosts(prev => [...prev, ...newPosts])
        setCurrentPage(nextPage)
        setHasMore(nextPage < data.totalPages)
        setLoadingMore(false)
      })
      .catch(() => setLoadingMore(false))
  }

  const handleShare = async (post: Post) => {
    const postUrl = `${window.location.origin}/blog/${post.slug}`
    
    // Track share event
    trackEvent.blogPostShare(post.title, post.slug)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: postUrl
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(postUrl)
      alert('Link copied to clipboard')
    }
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen bg-white pt-[72px] transition-transform duration-700 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>

      <main className="max-w-full mx-auto px-1 pt-1 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts published yet.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-1 space-y-1">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="block break-inside-avoid mb-1 group"
              >
                <Link href={`/blog/${post.slug}`} className="block relative overflow-hidden">
                  {/* Media Background */}
                  <div className="relative">
                    {post.mediaType === 'video' && post.coverVideo ? (
                      <div className="aspect-video relative">
                        <iframe
                          src={`https://www.youtube.com/embed/${post.coverVideo}?autoplay=1&mute=1&loop=1&playlist=${post.coverVideo}&controls=0&showinfo=0&modestbranding=1&playsinline=1`}
                          className="w-full h-full pointer-events-none"
                          allow="autoplay"
                          style={{ pointerEvents: 'none' }}
                        />
                        {/* Invisible overlay to capture clicks */}
                        <div className="absolute inset-0 cursor-pointer" style={{ pointerEvents: 'auto' }} />
                      </div>
                    ) : post.coverImage ? (
                      <div className="aspect-[4/5]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/5] bg-gradient-to-br from-gray-900 to-black" />
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:underline transition-all">
                        {post.title}
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-sm text-gray-200 line-clamp-3 mb-3">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <time className="text-xs text-gray-300">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading more posts...</p>
          </div>
        )}

        {/* End of Posts */}
        {!loading && !hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No more posts to load</p>
          </div>
        )}
      </main>
      </div>
    </>
  )
}
