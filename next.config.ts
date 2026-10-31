import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (see .github/workflows/nextjs.yml).
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
