/** @type {import('next').NextConfig} */
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
  /* other options */
};

export default nextConfig;