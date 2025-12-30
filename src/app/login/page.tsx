'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid password')
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="RotomLabs" 
                className="h-12 w-auto" 
              />
            </div>
            <p className="text-sm text-gray-600">Enter password to access</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all focus:border-gray-900 focus:shadow-sm"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-black text-white rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {loading ? 'Accessing...' : 'Access Site'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
