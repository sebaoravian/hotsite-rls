import Script from 'next/script'

interface OrganizationSchemaProps {
  url?: string
}

function getDefaultSettings() {
  return {
    siteName: "RotomLabs",
    canonicalUrl: "https://rotom-labs.com",
    siteDescription: "RotomLabs builds the digital backbone behind global companies: cloud architecture, data, AI, mobile platforms and secure integrations.",
    linkedinUrl: "https://linkedin.com/company/rotomlabs",
    instagramUrl: "https://instagram.com/rotom_labs",
  }
}

export function OrganizationSchema({ url }: OrganizationSchemaProps = {}) {
  const settings = getDefaultSettings()
  const baseUrl = url || settings.canonicalUrl
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    alternateName: 'Rotom Labs',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: settings.siteDescription,
    sameAs: [
      settings.linkedinUrl,
      settings.instagramUrl,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Business Inquiries',
      url: `${baseUrl}#contact`,
    },
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressCountry: 'AR',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'Madrid',
        addressCountry: 'ES',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'Barcelona',
        addressCountry: 'ES',
      },
    ],
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  url?: string
}

export function WebsiteSchema({ url }: WebsiteSchemaProps = {}) {
  const settings = getDefaultSettings()
  const baseUrl = url || settings.canonicalUrl
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    url: baseUrl,
    description: settings.siteDescription,
    publisher: {
      '@type': 'Organization',
      name: settings.siteName,
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BlogPostSchemaProps {
  title: string
  description: string
  slug: string
  publishedAt: Date
  updatedAt: Date
  coverImage?: string
  author: {
    name: string | null
    email: string
  }
  url?: string
}

export function BlogPostSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  coverImage,
  author,
  url = 'https://rotom-labs.com',
}: BlogPostSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: coverImage || `${url}/logo.png`,
    datePublished: publishedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: author.name || 'RotomLabs Team',
      email: author.email,
    },
    publisher: {
      '@type': 'Organization',
      name: 'RotomLabs',
      logo: {
        '@type': 'ImageObject',
        url: `${url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}/blog/${slug}`,
    },
  }

  return (
    <Script
      id="blogpost-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
