import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-6e4494acb16e4b9fa84741c1077fc6fa.r2.dev",
      },
    ],
  },
};

export default nextConfig;
