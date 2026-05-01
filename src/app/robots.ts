// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/draft/',
        '/_next/',
        '/*.json$',
      ],
    },
    sitemap: [
      'https://kebbidailynews.com/sitemap.xml',
      'https://kebbidailynews.com/sitemap-news.xml',
    ],
  };
}