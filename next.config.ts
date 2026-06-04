import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["192.168.0.216"],
  images: {
    unoptimized: true,
  },
  transpilePackages: ["three"],
};

export default nextConfig;
