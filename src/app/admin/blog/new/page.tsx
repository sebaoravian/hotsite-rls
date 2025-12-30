'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    mediaType: 'image' as 'image' | 'video',
    coverImage: '',
    coverVideo: '',
    published: false,
    // SEO fields
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImage: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Submitting post data:', formData)
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      console.log('Response:', { status: res.status, data })

      if (res.ok) {
        alert('✅ Post creado exitosamente')
        router.push('/admin/blog')
      } else {
        alert('❌ Error: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('❌ Error al crear el post')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value
              setFormData({ 
                ...formData, 
                title,
                slug: generateSlug(title)
              })
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="excerpt" className="block mb-2 text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900 min-h-[80px]"
          />
        </div>

        {/* Media Type Selection */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Cover Media Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                value="image"
                checked={formData.mediaType === 'image'}
                onChange={(e) => setFormData({ ...formData, mediaType: 'image' })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Image</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                value="video"
                checked={formData.mediaType === 'video'}
                onChange={(e) => setFormData({ ...formData, mediaType: 'video' })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Video (YouTube)</span>
            </label>
          </div>
        </div>

        {/* Conditional Media Input */}
        {formData.mediaType === 'image' ? (
          <div className="mb-6">
            <label htmlFor="coverImage" className="block mb-2 text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <input
              id="coverImage"
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        ) : (
          <div className="mb-6">
            <label htmlFor="coverVideo" className="block mb-2 text-sm font-medium text-gray-700">
              YouTube Video ID
            </label>
            <input
              id="coverVideo"
              type="text"
              value={formData.coverVideo}
              onChange={(e) => setFormData({ ...formData, coverVideo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
              placeholder="dQw4w9WgXcQ"
            />
            <p className="text-xs text-gray-500 mt-1">
              Solo el ID del video, ej: dQw4w9WgXcQ de youtube.com/watch?v=dQw4w9WgXcQ
            </p>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-700">
            Content (Markdown supported)
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900 min-h-[400px] font-mono text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>
        </div>

        {/* SEO Section */}
        <div className="border-t border-gray-200 pt-6 mt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Optimization</h3>
          
          <div className="mb-6">
            <label htmlFor="seoTitle" className="block mb-2 text-sm font-medium text-gray-700">
              SEO Title <span className="text-gray-500">(max 60 chars, optional)</span>
            </label>
            <input
              id="seoTitle"
              type="text"
              maxLength={60}
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
              placeholder="Leave empty to use post title"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
          </div>

          <div className="mb-6">
            <label htmlFor="seoDescription" className="block mb-2 text-sm font-medium text-gray-700">
              SEO Description <span className="text-gray-500">(max 160 chars, optional)</span>
            </label>
            <textarea
              id="seoDescription"
              maxLength={160}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900 min-h-[80px]"
              placeholder="Leave empty to use excerpt"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
          </div>

          <div className="mb-6">
            <label htmlFor="seoKeywords" className="block mb-2 text-sm font-medium text-gray-700">
              SEO Keywords <span className="text-gray-500">(comma separated, optional)</span>
            </label>
            <input
              id="seoKeywords"
              type="text"
              value={formData.seoKeywords}
              onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
              placeholder="cloud, architecture, AI, development"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="ogImage" className="block mb-2 text-sm font-medium text-gray-700">
              Open Graph Image URL <span className="text-gray-500">(1200x630, optional)</span>
            </label>
            <input
              id="ogImage"
              type="text"
              value={formData.ogImage}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
              placeholder="Leave empty to use cover image"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630px for social sharing</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
