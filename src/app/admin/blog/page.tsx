import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function BlogAdminPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-4">No blog posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="text-black underline hover:no-underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.author.name || post.author.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-black hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
