import type { NextConfig } from "next";

const isProd = true;
const buildId = `v-${Date.now()}`;

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["192.168.0.216"],
  images: {
    unoptimized: true,
  },
  transpilePackages: ["three"],
};

export default nextConfig;
