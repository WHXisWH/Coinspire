import { NextRequest, NextResponse } from 'next/server';
import { getCoinsNew } from '@zoralabs/coins-sdk';
import type { CoinDetails } from '@/types/zora';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '10');
  
  try {
    // SDKを使用して最新のコインを取得
    const response = await getCoinsNew({
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
    console.error('Error fetching new coins:', error);
    
    // モックデータを返す（本番環境ではエラーハンドリングを適切に）
    const mockCoins: CoinDetails[] = [
      {
        id: '3',
        name: 'New Coin 1',
        description: 'This is a newly created coin',
        address: '0x3456789012345678901234567890123456789012',
        symbol: 'NEW1',
        createdAt: new Date().toISOString(),
        creatorAddress: '0x1234567890123456789012345678901234567890',
        marketCap: '5000',
        volume24h: '1000',
        mediaUrl: 'ipfs://new-media-cid-1',
        imageUrl: 'ipfs://new-image-cid-1',
      },
      {
        id: '4',
        name: 'New Coin 2',
        description: 'Another newly created coin with potential',
        address: '0x4567890123456789012345678901234567890123',
        symbol: 'NEW2',
        createdAt: new Date().toISOString(),
        creatorAddress: '0x2345678901234567890123456789012345678901',
        marketCap: '3000',
        volume24h: '500',
        mediaUrl: 'ipfs://new-media-cid-2',
        imageUrl: 'ipfs://new-image-cid-2',
      }
    ];
    
    return NextResponse.json({ coins: mockCoins });
  }
}
