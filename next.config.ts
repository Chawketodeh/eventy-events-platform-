import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["utfs.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows all domains
        port: "",
      },
    ],
  },

  // no webpack overrides here

  // ignore eslint errors during Vercel build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
