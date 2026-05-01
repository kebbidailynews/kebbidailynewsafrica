/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable modern image formats for better Core Web Vitals
    formats: ['image/avif', 'image/webp'],
    
    // Configure for both local and remote images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kebbidailynews.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      // Add if you're using external image hosting
      // {
      //   protocol: 'https',
      //   hostname: '**.cloudinary.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
    ],
    
    // Local images don't need remotePatterns, but ensure they're in /public
    // If images are in /public/images/, use src="/images/photo.jpg"
    
    // Set device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Minimum cache TTL for images
    minimumCacheTTL: 60,
    
    // If images are completely broken, temporarily enable this to debug
    // unoptimized: true, // Enable this ONLY for debugging
  },
  
  // Compress responses with gzip
  compress: true,
  
  // Remove X-Powered-By header for security
  poweredByHeader: false,
  
  // Enable React strict mode for better development
  reactStrictMode: true,
  
  // Use SWC minification (faster than Terser)
  swcMinify: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
      // Cache static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      // Cache images
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=43200'
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;