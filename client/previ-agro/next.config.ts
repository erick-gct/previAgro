import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    // Ignora todos los errores de ESLint durante `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
