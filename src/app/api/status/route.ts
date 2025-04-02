import { NextResponse } from 'next/server';

/**
 * 環境やAPIの状態を返すエンドポイント
 * 注意: 本番環境では適切に保護するか、削除してください
 */
export async function GET() {
  // 安全に共有できる環境情報
  const environmentInfo = {
    nodeEnv: process.env.NODE_ENV,
    nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set',
    aiServiceConfigured: !!process.env.AI_SERVICE_URL,
    zoraApiConfigured: !!process.env.ZORA_API_KEY,
    nftStorageConfigured: !!process.env.NFT_STORAGE_API_KEY,
    baseRpcConfigured: !!process.env.NEXT_PUBLIC_BASE_RPC_URL,
    platformReferrerConfigured: !!process.env.NEXT_PUBLIC_PLATFORM_REFERRER_ADDRESS,
    buildTime: new Date().toISOString(),
  };

  return NextResponse.json({
    status: 'ok',
    message: 'API is running',
    environment: environmentInfo,
  });
}
