// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track events
export const event = (action: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

// Track custom events
export const trackEvent = {
  // Blog events
  blogPostView: (title: string, slug: string) => {
    event('blog_post_view', {
      event_category: 'Blog',
      event_label: title,
      value: slug
    })
  },
  
  blogPostShare: (title: string, slug: string) => {
    event('blog_post_share', {
      event_category: 'Blog',
      event_label: title,
      value: slug
    })
  },

  // Contact events
  contactFormSubmit: (campaign?: string) => {
    event('contact_form_submit', {
      event_category: 'Contact',
      event_label: campaign || 'direct',
      value: 1
    })
  },

  // Navigation events
  navClick: (section: string) => {
    event('nav_click', {
      event_category: 'Navigation',
      event_label: section
    })
  },

  // Campaign tracking
  campaignLanding: (campaign: string, source?: string, medium?: string) => {
    event('campaign_landing', {
      event_category: 'Campaign',
      campaign_name: campaign,
      campaign_source: source || 'unknown',
      campaign_medium: medium || 'unknown'
    })
  },

  // Team member click
  teamMemberClick: (name: string) => {
    event('team_member_click', {
      event_category: 'Team',
      event_label: name
    })
  },

  // External links
  externalLink: (url: string, label: string) => {
    event('external_link_click', {
      event_category: 'Outbound',
      event_label: label,
      value: url
    })
  }
}

// Get UTM parameters from URL
export const getUTMParams = () => {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content')
  }
}

// Save UTM to session storage
export const saveUTMToSession = () => {
  const utmParams = getUTMParams()
  if (utmParams && utmParams.utm_campaign) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmParams))
  }
}

// Get saved UTM from session
export const getSavedUTM = () => {
  if (typeof window === 'undefined') return null
  const saved = sessionStorage.getItem('utm_params')
  return saved ? JSON.parse(saved) : null
}
