import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kids Rewards',
    short_name: 'KidsRewards',
    description: 'Motivate your kids with points and badges',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffbeb',
    theme_color: '#f59e0b',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
