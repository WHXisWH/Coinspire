import { NextRequest, NextResponse } from 'next/server';
import { getCoinsTopGainers } from '@zoralabs/coins-sdk';
import type { CoinDetails } from '@/types/zora';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '10');
  
  try {
    // SDKを使用して人気上昇中のコインを取得
    const response = await getCoinsTopGainers({
      count: count
    });
    
    // SDKからのレスポンスを整形
    const coins: CoinDetails[] = [];
    
    if (response?.data?.exploreList?.edges) {
      response.data.exploreList.edges.forEach((edge: any) => {
        if (!edge || !edge.node) return;
        
        const node = edge.node;
        coins.push({
          id: node.id || '',
          name: node.name || '',
          description: node.description || '',
          address: node.address || '',
          symbol: node.symbol || '',
          createdAt: node.createdAt || '',
          creatorAddress: node.creatorAddress || '',
          marketCap: node.marketCap || '0',
          volume24h: node.volume24h || '0',
          imageUrl: node.media?.previewImage || '',
          mediaUrl: node.media?.originalUri || '',
          creatorProfile: node.creatorProfile || '',
          handle: node.handle || ''
        });
      });
    }
    
    return NextResponse.json({ coins });
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    
    // モックデータを返す（本番環境ではエラーハンドリングを適切に）
    const mockCoins: CoinDetails[] = [
      {
        id: '1',
        name: 'Example Coin 1',
        description: 'This is an example trending coin',
        address: '0x1234567890123456789012345678901234567890',
        symbol: 'EXC1',
        createdAt: new Date().toISOString(),
        creatorAddress: '0x0987654321098765432109876543210987654321',
        marketCap: '10000',
        volume24h: '5000',
        mediaUrl: 'ipfs://example-media-cid',
        imageUrl: 'ipfs://example-image-cid',
      },
      {
        id: '2',
        name: 'Example Coin 2',
        description: 'Another example coin with rising popularity',
        address: '0x2345678901234567890123456789012345678901',
        symbol: 'EXC2',
        createdAt: new Date().toISOString(),
        creatorAddress: '0x0987654321098765432109876543210987654321',
        marketCap: '8000',
        volume24h: '3000',
        mediaUrl: 'ipfs://example-media-cid-2',
        imageUrl: 'ipfs://example-image-cid-2',
      }
    ];
    
    return NextResponse.json({ coins: mockCoins });
  }
}
