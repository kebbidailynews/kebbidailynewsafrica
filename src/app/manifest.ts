// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kebbi Daily News',
    short_name: 'Kebbi News',
    description: 'Latest news from Kebbi State, Nigeria',
    start_url: '/',
    display: 'standalone',
    theme_color: '#CC0000',
    background_color: '#FFFFFF',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}