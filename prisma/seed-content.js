const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedContent() {
  console.log('🎨 Seeding content sections...')

  try {
    // 1. Hero Section
    console.log('Creating Hero section...')
    await prisma.heroSection.deleteMany({})
    const heroSection = await prisma.heroSection.create({
      data: {
        videoUrl: 'xdCPEZGSVt0',
        title: 'We build the digital backbone behind global companies.',
        description: "Cloud architecture, mobile platforms, secure integrations, data and AI. Designed for high-scale operations that can't fail."
      }
    })
    
    await prisma.heroButton.createMany({
      data: [
        { label: 'Explore capabilities', url: '#capabilities', order: 1, heroId: heroSection.id },
        { label: 'Start a conversation', url: '#contact', order: 2, heroId: heroSection.id }
      ]
    })
    console.log('✅ Hero section created')

    // 2. Statement Section
    console.log('Creating Statement section...')
    await prisma.statementSection.deleteMany({})
    await prisma.statementSection.create({
      data: {
        title: 'Technology done right, at scale.',
        description: 'We architect, build and operate mission-critical systems for companies that demand performance, reliability and clear outcomes.',
        videoUrl: 'xdCPEZGSVt0'
      }
    })
    console.log('✅ Statement section created')

    // 3. Capabilities Section
    console.log('Creating Capabilities section...')
    await prisma.capabilitiesSection.deleteMany({})
    const capabilitiesSection = await prisma.capabilitiesSection.create({
      data: {
        title: 'Capabilities',
        description: 'End-to-end technical capabilities. One strategic partner — from infrastructure and security to data, AI and product delivery.'
      }
    })

    const capabilities = [
      { title: 'Cloud Architecture & DevOps', description: 'AWS-first architectures, VPCs, serverless, CI/CD and cost optimization for multi-region deployments.', icon: 'Cloud', color: '#3B82F6', order: 1 },
      { title: 'Mobile Platforms', description: 'React Native apps for thousands of users with offline-first capabilities and multi-country rollouts.', icon: 'Smartphone', color: '#8B5CF6', order: 2 },
      { title: 'Web Platforms', description: 'Next.js web apps and administration consoles designed for clarity, performance and global access.', icon: 'Globe', color: '#EC4899', order: 3 },
      { title: 'Enterprise Integrations & APIs', description: 'SAP, ERPs, SSO, Azure AD, third-party APIs and event-driven architectures with strong governance.', icon: 'Link', color: '#F59E0B', order: 4 },
      { title: 'Data Engineering & Analytics', description: 'Data Lakes, ETL/ELT and BI stacks that turn raw signals into operational and strategic insights.', icon: 'BarChart3', color: '#10B981', order: 5 },
      { title: 'Security & Governance', description: 'Identity, roles, audit trails, encryption and policies designed into the core of the architecture.', icon: 'Shield', color: '#EF4444', order: 6 },
      { title: 'AI & Machine Learning', description: 'Predictive models, segmentation, and corporate chatbots connected to your data and operations.', icon: 'Brain', color: '#06B6D4', order: 7 },
      { title: 'Tech Strategy & Consulting', description: 'Roadmaps, architecture decisions and governance models to sustain long-term digital ecosystems.', icon: 'Lightbulb', color: '#8B5CF6', order: 8 },
      { title: 'Global Delivery', description: 'Experience running platforms across multiple countries, time zones and languages.', icon: 'MapPin', color: '#3B82F6', order: 9 }
    ]

    for (const cap of capabilities) {
      await prisma.capabilityItem.create({
        data: {
          ...cap,
          capabilitiesId: capabilitiesSection.id
        }
      })
    }
    console.log('✅ Capabilities section created with 9 items')

    // 3.1 Services Section (slider between Journey and Capabilities)
    console.log('Creating Services section...')
    await prisma.servicesSection.deleteMany({})
    const servicesSection = await prisma.servicesSection.create({
      data: {
        title: 'Our Services',
        description: 'A colloquial walkthrough of the main services we deliver.'
      }
    })

    const mock = 'https://via.placeholder.com/800x500.png?text=App+Mockup'
    const services = [
      {
        title: 'Order',
        description: 'Publish segmented product catalogs by client, cluster or region — each with tailored portfolios and pricing. Future-ready ecommerce for retail: abandoned carts, promotions, shipping frequencies, benefits and more.',
        mockupUrl: mock,
        order: 1
      },
      {
        title: 'Payments Gateway',
        description: 'Charge at the right moment: on purchase, on delivery or via credit accounts. Pay with balance, credit/debit card or MercadoLibre — all integrated with your operation.',
        mockupUrl: mock,
        order: 2
      },
      {
        title: 'Geolocation & Field Operations',
        description: 'Orchestrate your sales team with ease: who gathers prospects, who converts, who maintains relationships — all mapped and optimized.',
        mockupUrl: mock,
        order: 3
      },
      {
        title: 'Mobility & Logistics',
        description: 'From last-mile to broader logistics solutions — precise, connected and measured at every step.',
        mockupUrl: mock,
        order: 4
      },
      {
        title: 'Intelligent Routing',
        description: 'Field-level smart routing for large organizations — minimize travel, maximize impact.',
        mockupUrl: mock,
        order: 5
      },
      {
        title: 'Travel & Expenses',
        description: 'Controlled expenses via the app with ticket recognition and cost buckets — approval and supervision in real time.',
        mockupUrl: mock,
        order: 6
      },
      {
        title: 'Datalake & Machine Learning',
        description: 'Teach customers how to buy better and help you win — data pipelines and models aligned to decisions.',
        mockupUrl: mock,
        order: 7
      }
    ]

    for (const s of services) {
      await prisma.serviceItem.create({
        data: { ...s, sectionId: servicesSection.id }
      })
    }
    console.log('✅ Services section created with 7 items')

    // 4. Principles Section
    console.log('Creating Principles section...')
    await prisma.principlesSection.deleteMany({})
    const principlesSection = await prisma.principlesSection.create({
      data: {
        title: 'Our Principles',
        description: 'We build technology with a set of principles that guide everything we architect and deliver.'
      }
    })

    const principles = [
      { title: 'Clarity over complexity', description: 'Systems must be predictable and intentional. Complexity is managed through architecture, not exposed to the user.', icon: 'Sparkles', color: '#3B82F6', order: 1 },
      { title: 'Architecture first', description: 'We design solid foundations before building features. Architecture is what ensures longevity, stability and evolution.', icon: 'Boxes', color: '#8B5CF6', order: 2 },
      { title: 'Security by design', description: 'Identity, access, governance and protection are part of the core—not an afterthought.', icon: 'ShieldCheck', color: '#EC4899', order: 3 },
      { title: 'Performance as a baseline', description: 'Platforms must remain fast, reliable and responsive, regardless of scale.', icon: 'Zap', color: '#F59E0B', order: 4 },
      { title: 'Evolution without friction', description: 'Technology must adapt as the business grows. Everything we build is designed to evolve.', icon: 'TrendingUp', color: '#10B981', order: 5 },
      { title: 'Human-centric technology', description: 'The best systems empower people. We design for execution, learning and decision-making.', icon: 'Users', color: '#06B6D4', order: 6 }
    ]

    for (const principle of principles) {
      await prisma.principleItem.create({
        data: {
          ...principle,
          principlesId: principlesSection.id
        }
      })
    }
    console.log('✅ Principles section created with 6 items')

    // 5. Impact Section
    console.log('Creating Impact section...')
    await prisma.impactSection.deleteMany({})
    const impactSection = await prisma.impactSection.create({
      data: {
        title: 'Impact',
        description: 'What we build today is already running at scale in demanding environments.'
      }
    })

    const impacts = [
      { number: '30+', label: 'countries', icon: 'Globe2', color: '#3B82F6', order: 1 },
      { number: '10k+', label: 'DAUs', icon: 'Users2', color: '#8B5CF6', order: 2 },
      { number: 'Multi', label: 'region', icon: 'Network', color: '#EC4899', order: 3 },
      { number: 'End-to', label: 'end', icon: 'Layers', color: '#10B981', order: 4 }
    ]

    for (const impact of impacts) {
      await prisma.impactItem.create({
        data: {
          ...impact,
          impactId: impactSection.id
        }
      })
    }
    console.log('✅ Impact section created with 4 items')

    // 6. Timeline
    console.log('Creating Timeline...')
    await prisma.timelineItem.deleteMany({})
    const timelines = [
      { year: '2014', title: 'Foundation', description: 'RotomLabs is founded with a focus on building high-quality digital products.', color: '#3B82F6' },
      { year: '2016', title: 'Large-scale mobile ecosystems', description: 'We launch multi-country mobile platforms used by thousands of field users.', color: '#8B5CF6' },
      { year: '2018', title: 'Enterprise integrations & data discipline', description: 'Deep ERP integrations and our first major Data Lake unifying operational and learning data.', color: '#EC4899' },
      { year: '2020', title: 'AWS-first multi-tenant architecture', description: 'Serverless, containerized services and global deployments across regions.', color: '#F59E0B' },
      { year: '2022', title: 'AI & predictive insights', description: 'Machine learning models connecting training, execution and performance.', color: '#10B981' },
      { year: '2024', title: 'Platform Architecture 2.0', description: 'Unified architecture for mobile, web, data, AI, gamification and field execution.', color: '#06B6D4' },
      { year: '2025', title: 'Global scale & strategic advisory', description: 'We operate as strategic technology partners for global companies.', color: '#8B5CF6' }
    ]

    for (const timeline of timelines) {
      await prisma.timelineItem.create({ data: timeline })
    }
    console.log('✅ Timeline created with 7 items')

    // 7. Team Section
    console.log('Creating Team section...')
    await prisma.teamSection.deleteMany({})
    const teamSection = await prisma.teamSection.create({
      data: {
        title: 'The Team Behind RotomLabs',
        description: ''
      }
    })

    const teamMembers = [
      { name: 'Sebastián Martínez', role: 'CTO & Principal Architect', bio: 'Leads architecture, infrastructure, security and long-term strategy. Designs the digital foundations behind every ecosystem.', photo: '/team/sebastian.jpg', color: '#3B82F6', order: 1 },
      { name: 'Martina Miroli', role: 'Innovation & Strategy Director', bio: 'Drives discovery, product vision and innovation. Connects business needs with technical opportunities.', photo: '/team/martina.jpg', color: '#EC4899', order: 2 },
      { name: 'Giselle Fernández', role: 'Strategy & Delivery Director', bio: 'Ensures execution, planning and delivery quality across all initiatives.', photo: '/team/giselle.jpg', color: '#8B5CF6', order: 3 },
      { name: 'Mauro Panella', role: 'Head of Development', bio: 'Leads engineering frameworks, quality and technical execution across web and mobile.', photo: '/team/mauro.jpg', color: '#F59E0B', order: 4 },
      { name: 'Technical Team', role: 'Engineering & Operations', bio: 'Senior developers, mobile engineers, devops, data engineers, QA analysts and designers who build, operate and evolve complex ecosystems at scale.', photo: '/team/team.jpg', color: '#10B981', order: 5 }
    ]

    for (const member of teamMembers) {
      await prisma.teamMember.create({
        data: {
          ...member,
          teamId: teamSection.id
        }
      })
    }
    console.log('✅ Team section created with 5 members')

    // 8. Contact Section
    console.log('Creating Contact section...')
    await prisma.contactSection.deleteMany({})
    await prisma.contactSection.create({
      data: {
        mainTitle: "Let's build what's next.",
        mainDesc: "If you're planning, scaling or re-architecting a digital ecosystem, we can help you connect infrastructure, data and product into a single coherent strategy.",
        formTitle: "Get in touch",
        formDesc: "Tell us about your project",
        emailTo: 'contact@rotom-labs.com'
      }
    })
    console.log('✅ Contact section created')

    // 8.1 Clients Section
    console.log('Creating Clients section...')
    await prisma.clientsSection.deleteMany({})
    const clientsSection = await prisma.clientsSection.create({
      data: {
        title: 'Our Clients',
        description: 'Trusted by global companies.'
      }
    })
    // Seed multiple real logos from public/clients so UI is visible
    const clientLogos = [
      { name: 'Unilever', logoUrl: '/clients/unilever.png' },
      { name: 'Coca-Cola', logoUrl: '/clients/cocacola.png' },
      { name: 'Danone', logoUrl: '/clients/danone.png' },
      { name: 'LG', logoUrl: '/clients/lg.png' },
      { name: 'Microsoft', logoUrl: '/clients/microsoft.png' },
      { name: 'Renault', logoUrl: '/clients/renault.png' },
      { name: 'Shell', logoUrl: '/clients/shell.png' }
    ]

    for (let i = 0; i < clientLogos.length; i++) {
      const logo = clientLogos[i]
      await prisma.clientLogo.create({
        data: {
          name: logo.name,
          logoUrl: logo.logoUrl,
          order: i + 1,
          published: true,
          tint: null,
          sectionId: clientsSection.id
        }
      })
    }
    console.log(`✅ Clients section created with ${clientLogos.length} logos`)

    // 9. Offices
    console.log('Creating Offices...')
    await prisma.office.deleteMany({})
    const offices = [
      { code: 'BUE', address: 'Castillo 1366, C1414AXD, CABA, Argentina', email: 'bue@rotom-labs.com', order: 1 },
      { code: 'MAD', address: 'Calle de Serrano 93, 28006 Madrid, España', email: 'mad@rotom-labs.com', order: 2 },
      { code: 'BCN', address: 'Passeig de Gràcia 101, 08008 Barcelona, España', email: 'bcn@rotom-labs.com', order: 3 },
      { code: 'MEX', address: 'Av. Paseo de la Reforma 250, 06600, Ciudad de México, México', email: 'mex@rotom-labs.com', order: 4 },
      { code: 'SAO', address: 'Av. Paulista 1374, 01310-100, São Paulo, Brasil', email: 'sao@rotom-labs.com', order: 5 },
      { code: 'SCL', address: 'Av. Vitacura 2909, 7550032, Santiago, Chile', email: 'scl@rotom-labs.com', order: 6 }
    ]

    for (const office of offices) {
      await prisma.office.create({ data: office })
    }
    console.log('✅ Offices created with 6 locations')

    // 10. Footer Settings
    console.log('Creating Footer Settings...')
    await prisma.footerSettings.deleteMany({})
    const footerSettings = await prisma.footerSettings.create({
      data: {
        copyrightText: 'Copyright 2025',
        socialLinks: {
          create: [
            { name: 'LinkedIn', url: 'https://linkedin.com/company/rotomlabs', icon: 'Linkedin', order: 1 },
            { name: 'Instagram', url: 'https://instagram.com/rotom_labs', icon: 'Instagram', order: 2 }
          ]
        }
      }
    })
    console.log('✅ Footer settings created with 2 social links')

    console.log('')
    console.log('✅ All content sections created successfully!')

  } catch (error) {
    console.error('❌ Error seeding content:', error)
    throw error
  }
}

module.exports = { seedContent }

if (require.main === module) {
  seedContent()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}
