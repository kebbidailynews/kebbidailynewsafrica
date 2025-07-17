/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // For static site generation
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;