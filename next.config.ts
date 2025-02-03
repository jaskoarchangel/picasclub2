import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false, // Remove barras finais
  eslint: {
    ignoreDuringBuilds: true, // Ignora os erros de ESLint durante o build
  },
};

export default nextConfig;
