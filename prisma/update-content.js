const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateContent() {
  console.log('🔄 Actualizando contenido de secciones...')

  try {
    // Update Hero Section
    const heroSection = await prisma.heroSection.findFirst()
    if (heroSection) {
      await prisma.heroSection.update({
        where: { id: heroSection.id },
        data: {
          title: 'We build the digital backbone behind global companies.',
          description: "Cloud architecture, mobile platforms, secure integrations, data and AI. Designed for high-scale operations that can't fail."
        }
      })
      console.log('✅ Hero section updated')
    }

    // Update Statement Section
    const statementSection = await prisma.statementSection.findFirst()
    if (statementSection) {
      await prisma.statementSection.update({
        where: { id: statementSection.id },
        data: {
          title: 'Technology done right, at scale.',
          description: 'We architect, build and operate mission-critical systems for companies that demand performance, reliability and clear outcomes.'
        }
      })
      console.log('✅ Statement section updated')
    }

    // Update Capabilities Section
    const capabilitiesSection = await prisma.capabilitiesSection.findFirst()
    if (capabilitiesSection) {
      await prisma.capabilitiesSection.update({
        where: { id: capabilitiesSection.id },
        data: {
          title: 'Capabilities',
          description: 'End-to-end technical capabilities. One strategic partner — from infrastructure and security to data, AI and product delivery.'
        }
      })
      console.log('✅ Capabilities section updated')

      // Update Capabilities Items
      const capabilities = [
        { title: 'Cloud Architecture & DevOps', description: 'AWS-first architectures, VPCs, serverless, CI/CD and cost optimization for multi-region deployments.', order: 1 },
        { title: 'Mobile Platforms', description: 'React Native apps for thousands of users with offline-first capabilities and multi-country rollouts.', order: 2 },
        { title: 'Web Platforms', description: 'Next.js web apps and administration consoles designed for clarity, performance and global access.', order: 3 },
        { title: 'Enterprise Integrations & APIs', description: 'SAP, ERPs, SSO, Azure AD, third-party APIs and event-driven architectures with strong governance.', order: 4 },
        { title: 'Data Engineering & Analytics', description: 'Data Lakes, ETL/ELT and BI stacks that turn raw signals into operational and strategic insights.', order: 5 },
        { title: 'Security & Governance', description: 'Identity, roles, audit trails, encryption and policies designed into the core of the architecture.', order: 6 },
        { title: 'AI & Machine Learning', description: 'Predictive models, segmentation, and corporate chatbots connected to your data and operations.', order: 7 },
        { title: 'Tech Strategy & Consulting', description: 'Roadmaps, architecture decisions and governance models to sustain long-term digital ecosystems.', order: 8 },
        { title: 'Global Delivery', description: 'Experience running platforms across multiple countries, time zones and languages.', order: 9 }
      ]

      await prisma.capabilityItem.deleteMany({ where: { capabilitiesId: capabilitiesSection.id } })
      for (const cap of capabilities) {
        await prisma.capabilityItem.create({
          data: {
            ...cap,
            icon: '⚡',
            color: '#3B82F6',
            capabilitiesId: capabilitiesSection.id
          }
        })
      }
      console.log('✅ Capabilities items updated')
    }

    // Update Principles Section
    const principlesSection = await prisma.principlesSection.findFirst()
    if (principlesSection) {
      await prisma.principlesSection.update({
        where: { id: principlesSection.id },
        data: {
          title: 'Our Principles',
          description: 'We build technology with a set of principles that guide everything we architect and deliver.'
        }
      })
      console.log('✅ Principles section updated')

      // Update Principles Items
      const principles = [
        { title: 'Clarity over complexity', description: 'Systems must be predictable and intentional. Complexity is managed through architecture, not exposed to the user.', order: 1 },
        { title: 'Architecture first', description: 'We design solid foundations before building features. Architecture is what ensures longevity, stability and evolution.', order: 2 },
        { title: 'Security by design', description: 'Identity, access, governance and protection are part of the core—not an afterthought.', order: 3 },
        { title: 'Performance as a baseline', description: 'Platforms must remain fast, reliable and responsive, regardless of scale.', order: 4 },
        { title: 'Evolution without friction', description: 'Technology must adapt as the business grows. Everything we build is designed to evolve.', order: 5 },
        { title: 'Human-centric technology', description: 'The best systems empower people. We design for execution, learning and decision-making.', order: 6 }
      ]

      await prisma.principleItem.deleteMany({ where: { principlesId: principlesSection.id } })
      for (const principle of principles) {
        await prisma.principleItem.create({
          data: {
            ...principle,
            icon: '✓',
            color: '#10B981',
            principlesId: principlesSection.id
          }
        })
      }
      console.log('✅ Principles items updated')
    }

    // Update Impact Section
    const impactSection = await prisma.impactSection.findFirst()
    if (impactSection) {
      await prisma.impactSection.update({
        where: { id: impactSection.id },
        data: {
          title: 'Impact',
          description: 'What we build today is already running at scale in demanding environments.'
        }
      })
      console.log('✅ Impact section updated')

      // Update Impact Items
      const impacts = [
        { metric: '30+ countries', description: 'Platforms designed to operate in diverse markets.', order: 1 },
        { metric: '10k+ DAUs', description: 'Daily active users across mobile and web ecosystems.', order: 2 },
        { metric: 'Multi-region', description: 'Architectures ready for global resilience and performance.', order: 3 },
        { metric: 'End-to-end', description: 'From infrastructure and security to data, AI and UX.', order: 4 }
      ]

      await prisma.impactItem.deleteMany({ where: { impactId: impactSection.id } })
      for (const impact of impacts) {
        await prisma.impactItem.create({
          data: {
            ...impact,
            icon: '📊',
            color: '#8B5CF6',
            impactId: impactSection.id
          }
        })
      }
      console.log('✅ Impact items updated')
    }

    // Update Timeline Items
    const timelines = [
      { year: '2014', title: 'Foundation', description: 'RotomLabs is founded with a focus on building high-quality digital products.', color: '#3B82F6' },
      { year: '2016', title: 'Large-scale mobile ecosystems', description: 'We launch multi-country mobile platforms used by thousands of field users.', color: '#8B5CF6' },
      { year: '2018', title: 'Enterprise integrations & data discipline', description: 'Deep ERP integrations and our first major Data Lake unifying operational and learning data.', color: '#EC4899' },
      { year: '2020', title: 'AWS-first multi-tenant architecture', description: 'Serverless, containerized services and global deployments across regions.', color: '#F59E0B' },
      { year: '2022', title: 'AI & predictive insights', description: 'Machine learning models connecting training, execution and performance.', color: '#10B981' },
      { year: '2024', title: 'Platform Architecture 2.0', description: 'Unified architecture for mobile, web, data, AI, gamification and field execution.', color: '#06B6D4' },
      { year: '2025', title: 'Global scale & strategic advisory', description: 'We operate as strategic technology partners for global companies.', color: '#8B5CF6' }
    ]

    await prisma.timelineItem.deleteMany({})
    for (const timeline of timelines) {
      await prisma.timelineItem.create({ data: timeline })
    }
    console.log('✅ Timeline items updated')

    // Update Team Section
    const teamSection = await prisma.teamSection.findFirst()
    if (teamSection) {
      await prisma.teamSection.update({
        where: { id: teamSection.id },
        data: {
          title: 'The Team Behind RotomLabs',
          description: ''
        }
      })
      console.log('✅ Team section updated')

      // Update Team Members
      const teamMembers = [
        { name: 'Sebastián Martínez', role: 'CTO & Principal Architect', bio: 'Leads architecture, infrastructure, security and long-term strategy. Designs the digital foundations behind every ecosystem.', photo: '/team/sebastian.jpg', color: '#3B82F6', order: 1 },
        { name: 'Martina Miroli', role: 'Innovation & Strategy Director', bio: 'Drives discovery, product vision and innovation. Connects business needs with technical opportunities.', photo: '/team/martina.jpg', color: '#EC4899', order: 2 },
        { name: 'Giselle Fernández', role: 'Strategy & Delivery Director', bio: 'Ensures execution, planning and delivery quality across all initiatives.', photo: '/team/giselle.jpg', color: '#8B5CF6', order: 3 },
        { name: 'Mauro Panella', role: 'Head of Development', bio: 'Leads engineering frameworks, quality and technical execution across web and mobile.', photo: '/team/mauro.jpg', color: '#F59E0B', order: 4 },
        { name: 'Technical Team', role: 'Engineering & Operations', bio: 'Senior developers, mobile engineers, devops, data engineers, QA analysts and designers who build, operate and evolve complex ecosystems at scale.', photo: '/team/team.jpg', color: '#10B981', order: 5 }
      ]

      await prisma.teamMember.deleteMany({ where: { teamId: teamSection.id } })
      for (const member of teamMembers) {
        await prisma.teamMember.create({
          data: {
            ...member,
            teamId: teamSection.id
          }
        })
      }
      console.log('✅ Team members updated')
    }

    // Update Contact Section
    const contactSection = await prisma.contactSection.findFirst()
    if (contactSection) {
      await prisma.contactSection.update({
        where: { id: contactSection.id },
        data: {
          title: "Let's build what's next.",
          description: "If you're planning, scaling or re-architecting a digital ecosystem, we can help you connect infrastructure, data and product into a single coherent strategy."
        }
      })
      console.log('✅ Contact section updated')
    }

    console.log('')
    console.log('✅ Todos los contenidos han sido actualizados exitosamente!')

  } catch (error) {
    console.error('❌ Error actualizando contenidos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateContent()
