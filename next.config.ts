import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: process.env.BASE_PATH || 'out',
  basePath: process.env.BASE_PATH || '',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;