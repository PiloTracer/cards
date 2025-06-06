// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",          // ← add this line
  /* other config options here */
};

export default nextConfig;
