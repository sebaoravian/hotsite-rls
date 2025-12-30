import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  
  return NextResponse.json({ success: true })
}

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3100'))
}
