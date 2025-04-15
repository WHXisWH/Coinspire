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
    // 開発環境とプロダクション環境の両方でリライトを設定
    return [
      {
        source: '/api/ai/:path*',
        destination: `${process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
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
      // CORS設定を追加
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      }
    ];
  },
  output: 'standalone',
};

module.exports = nextConfig;
