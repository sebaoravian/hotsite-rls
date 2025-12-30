const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Fixing admin user...')
  
  // Check current user
  const currentUser = await prisma.user.findUnique({
    where: { email: 'admin@rotom-labs.com' }
  })
  
  if (!currentUser) {
    console.log('❌ Admin user not found!')
    return
  }
  
  console.log('Current user ID:', currentUser.id)
  
  // If ID is 'admin', we need to fix it
  if (currentUser.id === 'admin') {
    console.log('⚠️  ID is hardcoded as "admin", fixing...')
    
    // Delete and recreate with proper cuid
    await prisma.user.delete({
      where: { id: 'admin' }
    })
    
    const newUser = await prisma.user.create({
      data: {
        email: 'admin@rotom-labs.com',
        name: 'Admin',
        password: currentUser.password, // Keep the same hashed password
        role: 'ADMIN'
      }
    })
    
    console.log('✅ User recreated with proper ID:', newUser.id)
    console.log('⚠️  IMPORTANT: All users must logout and login again!')
  } else {
    console.log('✅ User ID is already correct (cuid format)')
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
