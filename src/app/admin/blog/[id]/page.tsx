'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  mediaType: string
  coverImage: string | null
  coverVideo: string | null
  published: boolean
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [postId, setPostId] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    mediaType: 'image' as 'image' | 'video',
    coverImage: '',
    coverVideo: '',
    published: false
  })

  useEffect(() => {
    params.then(({ id }) => {
      setPostId(id)
      fetchPost(id)
    })
  }, [params])

  const fetchPost = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`)
      if (res.ok) {
        const post: Post = await res.json()
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          mediaType: post.mediaType as 'image' | 'video',
          coverImage: post.coverImage || '',
          coverVideo: post.coverVideo || '',
          published: post.published
        })
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('❌ Error al cargar el post')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        alert('✅ Post actualizado exitosamente')
        router.push('/admin/blog')
      } else {
        alert('❌ Error: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('❌ Error al actualizar el post')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return

    try {
      const res = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('✅ Post eliminado')
        router.push('/admin/blog')
      } else {
        alert('❌ Error al eliminar')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('❌ Error al eliminar')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Editar Post</h1>

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
            <span className="text-sm font-medium text-gray-700">Publicado</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Eliminar Post
          </button>
        </div>
      </form>
    </div>
  )
}
