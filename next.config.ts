import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["paapi5-nodejs-sdk"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "/**" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com", pathname: "/**" },
      { protocol: "https", hostname: "images.amazon.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
