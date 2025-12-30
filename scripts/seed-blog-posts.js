const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const images = [
  'https://images.pexels.com/photos/12795/pexels-photo-12795.jpeg',
  'https://images.pexels.com/photos/34926318/pexels-photo-34926318.jpeg',
  'https://images.pexels.com/photos/30092945/pexels-photo-30092945.jpeg',
  'https://images.pexels.com/photos/12749792/pexels-photo-12749792.jpeg',
  'https://images.pexels.com/photos/32555467/pexels-photo-32555467.jpeg',
  'https://images.pexels.com/photos/29817508/pexels-photo-29817508.jpeg',
  'https://images.pexels.com/photos/29255731/pexels-photo-29255731.jpeg',
  'https://images.pexels.com/photos/30092952/pexels-photo-30092952.jpeg'
]

const videos = [
  'L3V7LKYPIUQ',
  'WZFIo4yj17c',
  'Sgxbx65IDeM',
  'Rs3-OJBYKSY',
  'vlDzYIIOYmM',
  'glENND73k4Q',
  'zEsbZSRtM7E'
]

const titles = [
  'The Future of Cloud Architecture',
  'Building Scalable AI Systems',
  'Data Engineering Best Practices',
  'Mobile Development Trends 2025',
  'Secure Integration Patterns',
  'Microservices at Scale',
  'Advanced Machine Learning Techniques',
  'API Design Principles',
  'DevOps Culture and Practices',
  'Real-time Data Processing',
  'Container Orchestration Deep Dive',
  'Serverless Architecture Patterns',
  'GraphQL vs REST APIs',
  'Modern Frontend Frameworks',
  'Database Optimization Strategies',
  'CI/CD Pipeline Excellence',
  'Kubernetes Best Practices',
  'Cloud Native Applications',
  'Event-Driven Architecture',
  'Distributed Systems Design',
  'Zero-Trust Security Models',
  'Edge Computing Revolution',
  'WebAssembly Performance',
  'Blockchain for Enterprise',
  'Quantum Computing Basics',
  'Neural Network Training',
  'Infrastructure as Code',
  'Service Mesh Patterns',
  'Platform Engineering',
  'Observability at Scale',
  'Chaos Engineering Principles',
  'Multi-Cloud Strategies',
  'API Gateway Design',
  'Stream Processing Systems',
  'Data Lake Architecture',
  'MLOps Best Practices',
  'Reactive Programming',
  'Cyber Security Essentials',
  'Agile at Scale',
  'Tech Leadership Guide'
]

const excerpts = [
  'Exploring the latest trends and innovations in cloud infrastructure and architecture.',
  'Learn how to build and deploy production-ready AI systems at scale.',
  'Essential practices for modern data engineering teams and workflows.',
  'Discover the cutting-edge tools and frameworks shaping mobile development.',
  'Implementing secure and reliable integration patterns for enterprise systems.',
  'Strategies for scaling microservices architecture in production environments.',
  'Advanced techniques for training and deploying machine learning models.',
  'Design principles for creating robust and developer-friendly APIs.',
  'Building a strong DevOps culture and implementing effective practices.',
  'Architecting systems for real-time data processing and analytics.',
  'Deep dive into container orchestration with Kubernetes and Docker.',
  'Leveraging serverless architecture for scalable cloud applications.',
  'Comparing GraphQL and REST for modern API development.',
  'Exploring the latest frontend frameworks and their use cases.',
  'Techniques for optimizing database performance and query efficiency.',
  'Building robust CI/CD pipelines for continuous delivery.',
  'Best practices for managing Kubernetes clusters in production.',
  'Designing and building cloud-native applications from scratch.',
  'Implementing event-driven architecture for scalable systems.',
  'Principles and patterns for designing distributed systems.',
  'Modern security architecture for zero-trust environments.',
  'Processing data at the edge for faster response times.',
  'Boosting web performance with WebAssembly technology.',
  'Practical blockchain applications for enterprise solutions.',
  'Understanding quantum computing and its future impact.',
  'Training neural networks efficiently and effectively.',
  'Managing infrastructure through declarative code.',
  'Service mesh implementation for microservices communication.',
  'Building internal developer platforms that teams love.',
  'Comprehensive observability strategies for complex systems.',
  'Testing system resilience through controlled failure.',
  'Navigating multiple cloud providers effectively.',
  'Building scalable and secure API gateways.',
  'Real-time stream processing architectures and patterns.',
  'Designing efficient and scalable data lakes.',
  'Operationalizing machine learning in production.',
  'Reactive programming paradigms for modern applications.',
  'Essential cybersecurity practices for development teams.',
  'Scaling agile methodologies across organizations.',
  'Leadership strategies for technical teams.'
]

const contents = [
  'Cloud architecture has evolved significantly over the past decade. In this comprehensive guide, we explore modern patterns, best practices, and emerging trends that are shaping the future of cloud infrastructure.\n\nFrom multi-cloud strategies to edge computing, understanding these concepts is crucial for building resilient and scalable systems.',
  'Artificial Intelligence is transforming industries across the globe. This article delves into the practical aspects of building AI systems that can handle production workloads.\n\nWe cover everything from data pipelines to model deployment, ensuring your AI initiatives deliver real business value.',
  'Data engineering is the backbone of modern analytics and AI initiatives. Learn the essential practices that top data teams use to build robust data platforms.\n\nDiscover tools, techniques, and workflows that enable efficient data processing at scale.',
  'Mobile development continues to evolve with new frameworks and platforms. Stay ahead of the curve by understanding the latest trends and tools.\n\nFrom cross-platform development to native performance optimization, we cover it all.',
  'Integration security is paramount in today\'s interconnected world. This guide explores proven patterns for building secure integrations.\n\nLearn how to protect your systems while maintaining flexibility and performance.',
  'Scaling microservices requires careful planning and execution. Discover strategies that successful teams use to manage complexity.\n\nFrom service mesh to observability, we explore the entire microservices ecosystem.',
  'Machine learning has moved from research to production. Learn advanced techniques for training models and deploying them at scale.\n\nOptimize your ML workflows and deliver faster, more accurate predictions.',
  'API design is an art and a science. Create APIs that developers love to use and that scale with your business.\n\nExplore design patterns, versioning strategies, and documentation best practices.',
  'DevOps is more than tools - it\'s a culture. Build teams that deliver software faster and more reliably.\n\nLearn practices that foster collaboration between development and operations.',
  'Real-time data processing enables instant insights and rapid decision-making. Architect systems that handle streaming data at scale.\n\nFrom Kafka to Flink, explore the tools powering real-time analytics.',
  'Container orchestration is essential for modern infrastructure. Master Kubernetes and related technologies.\n\nBuild resilient, self-healing systems that scale automatically.',
  'Serverless computing changes how we build applications. Leverage cloud platforms to focus on business logic.\n\nReduce operational overhead while maintaining scalability and reliability.',
  'Choosing between GraphQL and REST impacts your entire API strategy. Understand the trade-offs and make informed decisions.\n\nCompare performance, developer experience, and ecosystem maturity.',
  'Frontend development evolves rapidly. Stay current with the latest frameworks and their unique capabilities.\n\nFrom React to Vue to Svelte, choose the right tool for your project.',
  'Database performance impacts every aspect of your application. Implement optimization strategies that deliver results.\n\nIndex design, query tuning, and caching strategies for maximum efficiency.',
  'CI/CD pipelines enable rapid, reliable software delivery. Build automation that teams can trust.\n\nFrom testing to deployment, create workflows that catch issues early.',
  'Kubernetes powers modern cloud infrastructure. Learn best practices for production deployments.\n\nSecurity, networking, and resource management for enterprise clusters.',
  'Cloud-native applications leverage cloud platforms fully. Design systems that are resilient, scalable, and efficient.\n\nEmbrace containers, microservices, and declarative APIs.',
  'Event-driven architecture enables loose coupling and scalability. Build systems that react to events in real-time.\n\nMessage queues, event streams, and event sourcing patterns.',
  'Distributed systems are complex but powerful. Master the principles that make them work.\n\nConsensus, replication, and fault tolerance in distributed environments.',
  'Zero-trust security assumes no implicit trust. Implement modern security architectures.\n\nAuthentication, authorization, and encryption at every layer.',
  'Edge computing brings computation closer to data sources. Reduce latency and improve performance.\n\nArchitectures and use cases for edge deployment.',
  'WebAssembly enables near-native performance in browsers. Unlock new possibilities for web applications.\n\nLanguage support, tooling, and practical use cases.',
  'Blockchain technology extends beyond cryptocurrency. Explore enterprise applications.\n\nSmart contracts, supply chain, and identity management solutions.',
  'Quantum computing promises to solve previously intractable problems. Understand the fundamentals.\n\nAlgorithms, hardware, and potential applications.',
  'Neural networks power modern AI applications. Learn effective training techniques.\n\nOptimization, regularization, and hyperparameter tuning.',
  'Infrastructure as Code enables repeatable, version-controlled deployments. Adopt declarative approaches.\n\nTerraform, CloudFormation, and best practices.',
  'Service mesh provides observability and security for microservices. Implement patterns effectively.\n\nIstio, Linkerd, and practical deployment strategies.',
  'Platform engineering creates developer-friendly infrastructure. Build internal platforms.\n\nDeveloper experience, self-service, and golden paths.',
  'Observability provides insights into system behavior. Implement comprehensive monitoring.\n\nMetrics, logs, traces, and visualization strategies.',
  'Chaos engineering tests system resilience. Deliberately inject failures.\n\nExperimentation, tools, and organizational practices.',
  'Multi-cloud strategies avoid vendor lock-in. Navigate multiple providers.\n\nArchitecture patterns, cost optimization, and management.',
  'API gateways manage traffic and enforce policies. Design scalable solutions.\n\nRouting, rate limiting, and security features.',
  'Stream processing handles continuous data flows. Build real-time pipelines.\n\nKafka Streams, Flink, and windowing operations.',
  'Data lakes store diverse data at scale. Architect efficient solutions.\n\nStorage formats, partitioning, and query engines.',
  'MLOps operationalizes machine learning. Deploy and monitor models.\n\nPipelines, versioning, and continuous training.',
  'Reactive programming handles asynchronous data streams. Build responsive applications.\n\nObservables, operators, and backpressure management.',
  'Cybersecurity protects systems and data. Implement essential practices.\n\nThreat modeling, secure coding, and incident response.',
  'Agile at scale coordinates multiple teams. Implement frameworks effectively.\n\nSAFe, LeSS, and organizational transformation.',
  'Technical leadership requires unique skills. Guide teams to success.\n\nCommunication, mentorship, and strategic thinking.'
]

async function main() {
  console.log('Starting blog post seeding...')

  // Get admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@rotom-labs.com' }
  })

  if (!adminUser) {
    console.error('Admin user not found!')
    return
  }

  console.log(`Using admin user ID: ${adminUser.id}`)

  // Delete existing posts
  console.log('\n🗑️  Deleting existing posts...')
  const deleteResult = await prisma.post.deleteMany({})
  console.log(`Deleted ${deleteResult.count} existing posts`)

  // Mix media types: alternate between image and video, with some variation
  const mediaPattern = ['image', 'image', 'video', 'image', 'video', 'image', 'image', 'video', 'video', 'image']
  
  console.log('\n📝 Creating new posts...')
  for (let i = 0; i < 40; i++) {
    const mediaType = mediaPattern[i % mediaPattern.length]
    const isVideo = mediaType === 'video'
    
    const slug = titles[i].toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const postData = {
      title: titles[i],
      slug: slug,
      excerpt: excerpts[i],
      content: contents[i],
      mediaType: mediaType,
      coverImage: isVideo ? null : images[i % images.length],
      coverVideo: isVideo ? videos[i % videos.length] : null,
      published: true,
      publishedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Stagger dates
      authorId: adminUser.id
    }

    try {
      const post = await prisma.post.create({
        data: postData
      })
      console.log(`✅ Created post ${i + 1}/40: "${post.title}" (${mediaType})`)
    } catch (error) {
      console.error(`❌ Error creating post ${i + 1}:`, error.message)
    }
  }

  console.log('\n🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
