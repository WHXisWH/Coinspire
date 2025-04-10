/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // ← ✅ これを追加
    domains: [
      'nftstorage.link',
      'ipfs.io',
      'cloudflare-ipfs.com',
      'example.com', // For mock data during development
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.nftstorage.link',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
      },
    ],
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/ai/:path*',
          destination: `${process.env.AI_SERVICE_URL || 'http://localhost:5000'}/:path*`,
        },
      ];
    }
    return [];
  },
  output: 'standalone',
};

module.exports = nextConfig;