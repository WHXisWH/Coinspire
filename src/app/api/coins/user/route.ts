import { NextRequest, NextResponse } from 'next/server';
import { getProfileBalances } from '@zoralabs/coins-sdk';
import type { CoinDetails } from '@/types/zora';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // SDKを使用してユーザーのコイン残高を取得
    const response = await getProfileBalances({
      identifier: address,
      count: 50 // 取得する残高の数
    });
    
    // SDKからのレスポンスを整形
    // responseの形式を確認し、適切にデータを抽出
    const profileData = response?.data?.profile;
    
    // 正しいレスポンス構造に対応する処理
    const coins: CoinDetails[] = [];
    
    if (profileData && 
        typeof profileData === 'object' && 
        'coinBalances' in profileData && 
        profileData.coinBalances?.edges) {
      
      const edges = profileData.coinBalances.edges || [];
      
      edges.forEach((edge: any) => {
        if (!edge || !edge.node) return;
        
        const node = edge.node;
        const token = node.token || {};
        
        coins.push({
          id: token.id || '',
          name: token.name || '',
          description: token.description || '',
          address: token.address || '',
          symbol: token.symbol || '',
          createdAt: token.createdAt || '',
          creatorAddress: token.creatorAddress || '',
          marketCap: token.marketCap || '0',
          volume24h: token.volume24h || '0',
          imageUrl: token.media?.previewImage || '',
          mediaUrl: token.media?.originalUri || '',
          // 残高情報を追加
          balance: node.amount?.amountDecimal || 0,
          balanceRaw: node.amount?.amountRaw || '0',
          valueUsd: node.valueUsd || '0'
        });
      });
    }
    
    return NextResponse.json({ coins });
  } catch (error) {
    console.error('Error fetching user coins:', error);
    
    // モックデータを返す（本番環境ではエラーハンドリングを適切に）
    const mockCoins: CoinDetails[] = [
      {
        id: '5',
        name: 'User Coin 1',
        description: 'A coin owned by the user',
        address: '0x5678901234567890123456789012345678901234',
        symbol: 'USER1',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1週間前
        creatorAddress: '0x1234567890123456789012345678901234567890',
        marketCap: '2000',
        volume24h: '400',
        mediaUrl: 'ipfs://user-media-cid-1',
        imageUrl: 'ipfs://user-image-cid-1',
        balance: 100,
        balanceRaw: '100000000000000000000',
        valueUsd: '500'
      }
    ];
    
    return NextResponse.json({ coins: mockCoins });
  }
}
