export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { fetchTrendsFromAI } from '@/lib/ai';

/**
 * トレンドデータを返すAPIエンドポイント
 */
export async function GET() {
  try {
    // 環境フラグをチェック
    const enableAIFeatures = process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES !== 'false';
    
    if (!enableAIFeatures) {
      console.log('AI features are disabled. Returning static trend data.');
      return getStaticTrendData();
    }
    
    // AI分析エンジンからトレンドデータを取得
    const trendData = await fetchTrendsFromAI();
    
    return NextResponse.json(trendData, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (error) {
    console.error('Error in trends API route:', error);
    
    // エラー時はモックデータを返す
    return getStaticTrendData();
  }
}

// モックデータを返す関数
function getStaticTrendData() {
  return NextResponse.json({
    keywords: [
      { text: 'NFT', value: 30 },
      { text: 'Web3', value: 25 },
      { text: 'ZORA', value: 22 },
      { text: '仮想通貨', value: 20 },
      { text: 'ミーム', value: 18 },
      { text: 'AI生成', value: 15 },
      { text: 'クリプトアート', value: 12 },
    ],
    themes: [
      { name: 'サイバーパンク', popularity: 0.8 },
      { name: 'レトロ風アート', popularity: 0.75 },
      { name: '日本のアニメスタイル', popularity: 0.7 },
      { name: 'ミニマリスト', popularity: 0.65 },
      { name: '抽象的なデジタルアート', popularity: 0.6 },
    ],
    colorPalettes: [
      { name: 'ネオン', colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF00AA'] },
      { name: 'パステル', colors: ['#FFD1DC', '#FFECF1', '#A2D2FF', '#EFD3FF'] },
      { name: 'レトロ', colors: ['#F4A460', '#4682B4', '#B22222', '#DAA520'] },
    ],
    visualStyles: [
      { name: 'ピクセルアート', examples: ['https://example.com/pixel1.jpg'] },
      { name: 'グリッチアート', examples: ['https://example.com/glitch1.jpg'] },
      { name: '3Dレンダリング', examples: ['https://example.com/3d1.jpg'] },
    ],
    updatedAt: new Date().toISOString()
  }, { 
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    }
  });
}
