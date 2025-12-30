import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all content sections
export async function GET() {
  try {
    const [
      hero,
      statement,
      timeline,
      services,
      capabilities,
      principles,
      impact,
      team,
      contact,
      offices,
      footer
    ] = await Promise.all([
      prisma.heroSection.findFirst({ include: { buttons: { orderBy: { order: 'asc' } } } }),
      prisma.statementSection.findFirst({ include: { items: { orderBy: { order: 'asc' } } } }),
      prisma.timelineItem.findMany({ orderBy: { year: 'asc' } }),
      prisma.servicesSection.findFirst({ include: { items: { orderBy: { order: 'asc' } } } }),
      prisma.capabilitiesSection.findFirst({ include: { items: { orderBy: { order: 'asc' } } } }),
      prisma.principlesSection.findFirst({ include: { items: { orderBy: { order: 'asc' } } } }),
      prisma.impactSection.findFirst({ include: { items: { orderBy: { order: 'asc' } } } }),
      prisma.teamSection.findFirst({ include: { members: { orderBy: { order: 'asc' } } } }),
      prisma.contactSection.findFirst(),
      prisma.office.findMany({ orderBy: { order: 'asc' } }),
      prisma.footerSettings.findFirst({ include: { socialLinks: { orderBy: { order: 'asc' } } } })
    ])

    return NextResponse.json({
      hero,
      statement,
      timeline,
      services,
      capabilities,
      principles,
      impact,
      team,
      contact,
      offices,
      footer
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
