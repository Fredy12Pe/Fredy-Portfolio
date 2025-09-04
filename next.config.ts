import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the workspace root to this project to avoid lockfile root confusion
    root: __dirname,
  },
  // Ensure static assets are served properly
  images: {
    unoptimized: true,
  },
  // Ensure public folder is served correctly
  trailingSlash: false,
  // Add headers for static assets
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
    ];
  },
};

export default nextConfig;
