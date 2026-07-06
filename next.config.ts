import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Prevents Vercel from crashing or hanging when loading external Amazon product images
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Strip console logs in production for faster execution
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
