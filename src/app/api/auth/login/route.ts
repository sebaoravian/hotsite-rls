import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rotomlabs2024'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Try to get the admin user from database, but don't fail if DB is not available
    let adminUser
    try {
      adminUser = await prisma.user.findUnique({
        where: { email: 'admin@rotom-labs.com' }
      })
    } catch (dbError) {
      console.error('Database error (continuing with temp admin):', dbError)
      // Use a temporary admin user if database is not available
      adminUser = {
        id: 'temp-admin-id',
        email: 'admin@rotom-labs.com'
      }
    }

    if (!adminUser) {
      // Create a temporary admin user for token generation
      adminUser = {
        id: 'temp-admin-id',
        email: 'admin@rotom-labs.com'
      }
    }

    const token = generateToken({
      userId: adminUser.id,
      email: adminUser.email
    })

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
