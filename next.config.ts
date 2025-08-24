import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the workspace root to this project to avoid lockfile root confusion
    root: __dirname,
  },
};

export default nextConfig;
