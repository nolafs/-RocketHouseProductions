import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kids Guitar Dojo',
    short_name: 'Guitar Dojo',
    description: 'Kids Guitar Dojo is a fun way to learn guitar for kids.',
    start_url: '/',
    display: 'standalone',
    background_color: '#222337',
    theme_color: '#7c80ae',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        "src": "/android-chrome-114x114.png",
        "sizes": "114x114",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      },
      {
        "src": "maskable_icon_x192.png",
        "sizes": "196x196",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "maskable_icon_x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
  }
}
