import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    // Ignora todos los errores de ESLint durante `next build`
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Esto puede ayudar con los problemas de client-reference-manifest
    serverComponentsExternalPackages: [],
  },
  // Asegurar que el build sea estable
  swcMinify: true,
  // Optimizar para producción
  poweredByHeader: false,
  // Configuración específica para Vercel
  output: 'standalone',
};

export default nextConfig;
