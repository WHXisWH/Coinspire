import axios, { AxiosRequestConfig } from 'axios';
import type { TrendAnalysis, Template } from '@/types/trends';

// AIサービスURL
const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'https://coinspire-ai.onrender.com';

// AIサービスタイムアウト (ms)
const AI_SERVICE_TIMEOUT = parseInt(process.env.AI_SERVICE_TIMEOUT || '30000', 10);

// AIサービスAPIキー
const AI_SERVICE_API_KEY = process.env.AI_SERVICE_API_KEY;

// モック機能フラグ
const ENABLE_MOCK_DATA = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== 'false';

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
    console.error('Error details:', error.response || error.request || error);

    // CORSエラーの特殊処理
    if (error.message === 'Network Error') {
      console.warn('Possible CORS issue detected. Using fallback data.');
    }

    return Promise.reject(error);
  }
);

/**
 * トレンド分析データを取得
 * @returns トレンド分析結果
 */
export async function fetchTrendsFromAI(): Promise<TrendAnalysis> {
  try {
    // APIの存在確認
    if (!AI_SERVICE_URL) {
      console.warn('AI Service URL is not defined. Using mock data.');
      return getMockTrendData();
    }

    console.log('Fetching trends from AI service:', AI_SERVICE_URL);
    const response = await aiClient.get('/api/trends');
    console.log('AI service response:', response.status);

    return response.data;
  } catch (error) {
    console.error('Error fetching trends from AI service:', error);
    console.log('Using mock data as fallback');
    return getMockTrendData();
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
    // フォールバック動作の有効化
    if (ENABLE_MOCK_DATA) {
      // モックデータを返す確率を50%に設定(テスト用)
      if (Math.random() < 0.5) {
        console.log('Using mock data for testing');
        return getMockRecommendationData(options);
      }
    }

    console.log('Fetching recommendations from AI service with params:', params);
    const response = await aiClient.get('/api/recommendation', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations from AI service:', error);
    return getMockRecommendationData(options);
  }
}

/**
 * テンプレートを取得
 * @returns テンプレート配列
 */
export async function fetchTemplatesFromAI(options: {
  keywords?: string[];
  themes?: string[];
  count?: number;
} = {}): Promise<Template[]> {
  try {
    console.log('Fetching templates from AI service with options:', options);
    const response = await aiClient.get('/api/templates', { params: options });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching templates from AI service:', error);
    return getMockTemplates(options);
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
    templates: getMockTemplates({
      keywords: options.keywords,
      count: options.count
    }),
    prompts: [
      `サイバーパンクな都市風景、ネオンの光、${keywordsText}、高層ビル、未来的`,
      `抽象的な${style}アート、鮮やかな色彩、${keywordsText}、流動的なフォルム`,
      `${style}風の風景、デジタルアート、${keywordsText}、高品質、詳細`
    ]
  };
}

/**
 * モックテンプレートを生成
 */
function getMockTemplates(options: {
  keywords?: string[];
  themes?: string[];
  count?: number;
} = {}): Template[] {
  const count = options.count || 5;
  const keywordsText = options.keywords?.join(', ') || 'NFT, Web3, クリプトアート';

  const templates: Template[] = [
    {
      id: 'template-cyber-1',
      name: 'サイバーパンク デザイン',
      description: '鮮やかな色彩とテクノロジー感あふれるデザイン',
      imageUrl: '/images/templates/cyber-1.png',
      tags: ['サイバーパンク', '未来的', 'テック'],
      aiPrompt: `サイバーパンクな世界、${keywordsText}、ネオンの光、未来都市`
    },
    {
      id: 'template-abstract-1',
      name: '抽象的 アート',
      description: '幾何学的な形状と複雑なパターンを用いた抽象的なデザイン',
      imageUrl: '/images/templates/abstract-1.png',
      tags: ['抽象', 'パターン', 'カラフル'],
      aiPrompt: `抽象的なデジタルアート、${keywordsText}、幾何学模様、波状のパターン`
    },
    {
      id: 'template-anime-1',
      name: 'アニメ風 イラスト',
      description: '日本のアニメスタイルを取り入れたカラフルなイラスト',
      imageUrl: '/images/templates/anime-1.png',
      tags: ['アニメ', 'イラスト', 'カラフル'],
      aiPrompt: `アニメスタイルのイラスト、${keywordsText}、鮮やかな色彩、2Dスタイル`
    },
    {
      id: 'template-minimal-1',
      name: 'ミニマル デザイン',
      description: 'シンプルで洗練されたミニマルデザイン',
      imageUrl: '/images/templates/minimal-1.png',
      tags: ['ミニマル', 'シンプル', '洗練'],
      aiPrompt: `ミニマルなデザイン、${keywordsText}、シンプル、余白、少ない色`
    },
    {
      id: 'template-retro-1',
      name: 'レトロ スタイル',
      description: '80年代や90年代を思わせるレトロなデザイン',
      imageUrl: '/images/templates/retro-1.png',
      tags: ['レトロ', 'ビンテージ', 'ノスタルジック'],
      aiPrompt: `レトロスタイル、${keywordsText}、80年代、ビンテージ感、ノスタルジック`
    },
    {
      id: 'template-pixel-1',
      name: 'ピクセルアート スタイル',
      description: 'ドット絵風のピクセルアートスタイル',
      imageUrl: '/images/templates/pixel-1.png',
      tags: ['ピクセルアート', 'レトロゲーム', '8ビット'],
      aiPrompt: `ピクセルアート、${keywordsText}、ドット絵、8ビットスタイル、レトロゲーム`
    }
  ];

  return templates.slice(0, Math.min(count, templates.length));
}
