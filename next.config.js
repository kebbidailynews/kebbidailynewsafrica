/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  // ── www → non-www canonical redirect ──────────────────────────
  // Belt-and-suspenders alongside the netlify.toml redirect.
  // Ensures Next.js itself never serves www URLs.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.kebbidailynews.com' }],
        destination: 'https://kebbidailynews.com/:path*',
        permanent: true, // 301
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
      // www kept so Next.js can process any legacy image URLs
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
          // REMOVED: global Link canonical header — it was overriding every
          // page's own canonical with the homepage URL, causing GSC to report
          // "Redirect error" on all /category/* pages. Each page now declares
          // its own canonical via generateMetadata → alternates.canonical.
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
      // News article pages: no-cache so Google always gets fresh content
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