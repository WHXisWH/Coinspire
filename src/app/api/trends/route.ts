import { NextResponse } from 'next/server';
import axios from 'axios';

// AIサービスURL
// 注意: 実運用環境ではlocalhost:5000は使用できないため、環境変数またはフォールバックURLを使用する
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || '/api/ai';
const AI_SERVICE_API_KEY = process.env.AI_SERVICE_API_KEY;

export async function GET() {
  // ビルド時にはモックデータを返す
  if (process.env.NODE_ENV === 'production') {
    return getStaticTrendData();
  }

  try {
    // AI分析エンジンからトレンドデータを取得
    // 実際のプロダクションでは、このデータをキャッシュするか、
    // 定期的にバックグラウンドジョブで更新することを検討
    const response = await axios.get(`${AI_SERVICE_URL}/trends`, {
      headers: AI_SERVICE_API_KEY ? {
        'X-API-Key': AI_SERVICE_API_KEY
      } : undefined,
      // タイムアウトを設定
      timeout: 3000
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching trends:', error);
    
    // AIサービスが利用できない場合、モックデータを返す
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
    ]
  }, { status: 200 });
}
