import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? "/ai-study-platform" : "",
  images: { unoptimized: true },
};

export default nextConfig;
