import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the workspace root to this project to avoid lockfile root confusion
    root: __dirname,
  },
  // Optimize images for better performance
  images: {
    formats: ['image/webp'],
    qualities: [75, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Ensure public folder is served correctly
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/redesign", destination: "/", permanent: true },
      { source: "/redesign/about", destination: "/about", permanent: true },
      { source: "/redesign/contact", destination: "/contact", permanent: true },
    ];
  },
  // Add headers for static assets and performance
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Only the files under /projects (images, videos), not the case study pages themselves.
        // A long cache on the pages kept the old Grove page showing in the browser.
        source: '/projects/:path((?:.*)\\.(?:png|PNG|jpg|JPG|jpeg|webp|mp4|MP4|svg|riv))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Enable compression
  compress: true,
};

export default nextConfig;
