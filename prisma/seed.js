const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  console.log('')

  // 1. Crear usuario admin si no existe
  const existingUser = await prisma.user.findFirst()
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@rotom-labs.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      }
    })

    console.log('✅ Created admin user:', admin.email)
  } else {
    console.log('✅ Admin user already exists')
  }
  console.log('')

  // 2. Seed content sections (Hero, Statement, Capabilities, etc.)
  const { seedContent } = require('./seed-content')
  await seedContent()
  console.log('')

  // 3. Create default site settings if not exists
  console.log('🔧 Creating site settings...')
  const existingSettings = await prisma.siteSettings.findFirst()
  
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: "RotomLabs",
        siteTitle: "RotomLabs — Digital Backbone",
        siteDescription: "RotomLabs builds the digital backbone behind global companies: cloud architecture, data, AI, mobile platforms and secure integrations.",
        siteKeywords: "cloud architecture, data engineering, AI development, mobile platforms, secure integrations, digital transformation, backend development, API development, microservices",
        twitterHandle: "@rotom_labs",
        linkedinUrl: "https://linkedin.com/company/rotomlabs",
        instagramUrl: "https://instagram.com/rotom_labs",
        canonicalUrl: "https://rotom-labs.com",
        locale: "en_US",
        language: "en",
      }
    })
    console.log('✅ Site settings created')
  } else {
    console.log('✅ Site settings already exist')
  }
  console.log('')

  // 4. Seed blog posts
  const { seedBlogPosts } = require('./seed-blog')
  await seedBlogPosts()
  console.log('')

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ Database seeded successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('⚠️  ADMIN CREDENTIALS:')
  console.log('📧 Email:    admin@rotom-labs.com')
  console.log('🔑 Password: admin123')
  console.log('')
  console.log('⚠️  CHANGE THIS PASSWORD IN PRODUCTION!')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
