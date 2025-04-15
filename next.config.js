/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      'nftstorage.link',
      'ipfs.io',
      'cloudflare-ipfs.com',
      'example.com', // For mock data during development
      'placehold.co', // For placeholder images
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
  // 静的アセットへのフォールバック有効化
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  output: 'standalone',
};
