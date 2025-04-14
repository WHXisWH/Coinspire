import axios, { AxiosRequestConfig } from 'axios';
import type { TrendAnalysis } from '@/types/trends';

// AIサービスURL
const AI_SERVICE_URL = 
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'https://coinspire.onrender.com';

// AIサービスタイムアウト (ms)
const AI_SERVICE_TIMEOUT = parseInt(process.env.AI_SERVICE_TIMEOUT || '60000', 10);

// AIサービスAPIキー
const AI_SERVICE_API_KEY = process.env.AI_SERVICE_API_KEY;

// モック機能フラグ
const ENABLE_MOCK_DATA = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true';

// AIサービス用Axiosインスタンス
const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: AI_SERVICE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    ...(AI_SERVICE_API_KEY ? { 'X-API-Key': AI_SERVICE_API_KEY } : {})
  }
});

// 基本的なエラーハンドリング
aiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('AI Service Error:', error.message || 'Unknown error');
    // エラーを再スローして、呼び出し元で適切に処理できるようにする
    return Promise.reject(error);
  }
);

/**
 * トレンド分析データを取得
 * @returns トレンド分析結果
 */
export async function fetchTrendsFromAI(): Promise<TrendAnalysis> {
  try {
    const response = await aiClient.get('/trends');
    return response.data;
  } catch (error) {
    console.error('Error fetching trends from AI service:', error);
    if (ENABLE_MOCK_DATA) {
      console.log('Falling back to mock data');
      return getMockTrendData();
    }
    throw error;
  }
}

/**
 * レコメンデーションを取得
 * @param options パラメータオプション
 * @returns レコメンデーション結果
 */
export async function fetchRecommendationsFromAI(options: { 
  keywords?: string[]; 
  style?: string;
  count?: number;
}) {
  const params: Record<string, string> = {};
  
  if (options.keywords && options.keywords.length > 0) {
    params.keywords = options.keywords.join(',');
  }
  
  if (options.style) {
    params.style = options.style;
  }
  
  if (options.count) {
    params.count = options.count.toString();
  }
  
  try {
    const response = await aiClient.get('/recommendation', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations from AI service:', error);
    if (ENABLE_MOCK_DATA) {
      console.log('Falling back to mock recommendation data');
      return getMockRecommendationData(options);
    }
    throw error;
  }
}

/**
 * モックトレンドデータを取得
 * @returns モックトレンドデータ
 */
function getMockTrendData(): TrendAnalysis {
  return {
    keywords: [
      { text: 'NFT', value: 30 },
      { text: 'Web3', value: 25 },
      { text: 'ZORA', value: 22 },
      { text: '仮想通貨', value: 20 },
      { text: 'ミーム', value: 18 },
      { text: 'AI生成', value: 15 },
      { text: 'クリプトアート', value: 12 },
      { text: 'メタバース', value: 10 },
      { text: 'ジェネラティブ', value: 9 },
      { text: 'コレクション', value: 8 },
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
      { name: '手描き風', examples: ['https://example.com/hand1.jpg'] },
      { name: '平面デザイン', examples: ['https://example.com/flat1.jpg'] },
    ],
    updatedAt: new Date().toISOString()
  };
}

/**
 * モックレコメンデーションデータを取得
 * @param options パラメータオプション
 * @returns モックレコメンデーションデータ
 */
function getMockRecommendationData(options: { 
  keywords?: string[]; 
  style?: string;
  count?: number;
}) {
  const style = options.style || 'ピクセルアート';
  const keywordsText = options.keywords?.join(', ') || 'NFT, Web3, クリプトアート';
  
  return {
    templates: [
      {
        id: 'template-cyber-1',
        name: `${style} デザイン`,
        description: '鮮やかな色彩とテクノロジー感あふれるデザイン',
        imageUrl: '/images/templates/cyber-1.png',
        tags: ['サイバー', '未来的', 'テック'],
        aiPrompt: `サイバーパンクな世界、${keywordsText}、ネオンの光、未来都市`
      },
      {
        id: 'template-abstract-1',
        name: `抽象的 アート`,
        description: '幾何学的な形状と複雑なパターンを用いた抽象的なデザイン',
        imageUrl: '/images/templates/abstract-1.png',
        tags: ['抽象', 'パターン', 'カラフル'],
        aiPrompt: `抽象的なデジタルアート、${keywordsText}、幾何学模様、波状のパターン`
      }
    ],
    prompts: [
      `サイバーパンクな都市風景、ネオンの光、${keywordsText}、高層ビル、未来的`,
      `抽象的な${style}アート、鮮やかな色彩、${keywordsText}、流動的なフォルム`,
      `${style}風の風景、デジタルアート、${keywordsText}、高品質、詳細`
    ]
  };
}
