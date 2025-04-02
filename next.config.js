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
  // 修正: AIサービスへのリダイレクトはlocalhost:5000以外にする
  async rewrites() {
    // 開発環境でのみリダイレクト設定を行う
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
  // Vercelでの静的生成を無効にする
  output: 'standalone',
};

module.exports = nextConfig;
