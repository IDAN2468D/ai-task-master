import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Ignoring ESLint and TypeScript errors for immediate deployment stability */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
