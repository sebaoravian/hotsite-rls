import { cookies } from 'next/headers'
import { verifyToken } from './auth'

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  
  if (!token) return null
  
  return verifyToken(token.value)
}

export async function requireAuth() {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}
