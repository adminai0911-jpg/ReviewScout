import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: "/((?!api/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
