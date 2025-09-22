import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour déploiement statique IPFS
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Suppression des headers API car plus de routes API
};

export default nextConfig;
