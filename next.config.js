/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  // ── www → non-www canonical redirect ──────────────────────────
  // Netlify already handles this at the DNS level, but having it
  // here too ensures Next.js itself never serves www URLs — which
  // clears the "Page with redirect" errors in Google Search Console.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.kebbidailynews.com' }],
        destination: 'https://kebbidailynews.com/:path*',
        permanent: true, // 301 — tells Google this is the real URL forever
      },
    ];
  },

  // ── Images ────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kebbidailynews.com',
      },
      // www still needed here so Next.js can process any legacy
      // image URLs that might still reference the www subdomain
      {
        protocol: 'https',
        hostname: 'www.kebbidailynews.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],

    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // ── General ───────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // ── HTTP Headers ──────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Tells Google and other crawlers this is the canonical domain
          {
            key: 'Link',
            value: '<https://kebbidailynews.com>; rel="canonical"',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=43200',
          },
        ],
      },
      // ── News article pages: no-cache so Google always gets fresh content ──
      {
        source: '/news/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;