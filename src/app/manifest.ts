import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RotomLabs — Digital Backbone',
    short_name: 'RotomLabs',
    description: 'RotomLabs builds the digital backbone behind global companies: cloud architecture, data, AI, mobile platforms and secure integrations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
