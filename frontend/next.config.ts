// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "backend",
        port: "8000",
        pathname: "/static/cards/**",
      },
    ],
  },
};

export default nextConfig;
