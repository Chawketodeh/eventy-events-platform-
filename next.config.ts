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
};

export default nextConfig;
