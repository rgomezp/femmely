import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["paapi5-nodejs-sdk"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "/**" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com", pathname: "/**" },
      { protocol: "https", hostname: "images.amazon.com", pathname: "/**" },
      // Vercel Blob (per-store subdomain)
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
