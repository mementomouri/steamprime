import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trustseal.enamad.ir',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.samandehi.ir',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
