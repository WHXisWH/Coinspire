/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
    return [
      // Proxy API requests to AI service in development
      process.env.NODE_ENV === 'development'
        ? {
            source: '/api/ai/:path*',
            destination: `${process.env.AI_SERVICE_URL || 'http://localhost:5000'}/:path*`,
          }
        : null,
    ].filter(Boolean);
  },
};

module.exports = nextConfig;
