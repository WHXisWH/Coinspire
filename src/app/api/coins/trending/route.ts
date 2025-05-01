import { NextRequest, NextResponse } from 'next/server';
import { getCoinsTopGainers } from '@zoralabs/coins-sdk';
import type { CoinDetails } from '@/types/zora';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '10');
  const chainId = parseInt(searchParams.get('chainId') || '84532'); // Base Sepolia
  
  try {
    // SDKを使用して人気上昇中のコインを取得
    const response = await getCoinsTopGainers({
      count: count,
      chainId: chainId
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
    return NextResponse.json({ coins: [] });
  }
}
