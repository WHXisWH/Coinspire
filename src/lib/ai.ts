import axios from 'axios';
import type { TrendAnalysis, Template } from '@/types/trends';

const API_CALL_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_CALL_TIMEOUT || '30000', 10);

const ENABLE_MOCK_DATA = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== 'false';

const apiClient = axios.create({
  timeout: API_CALL_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Call Error:', error.message || 'Unknown error');
    console.error('Error details:', error.response || error.request || error);
    return Promise.reject(error);
  }
);

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
    console.log('Fetching recommendations via API route with params:', params);
    const response = await apiClient.get('/api/proxy/recommendation', { params });
    return response.data || { templates: [], prompts: [] };

  } catch (error) {
    console.error('Error fetching recommendations via API route:', error);
    console.log('Using mock data as fallback due to API route error (fetchRecommendationsFromAI)');
    return getMockRecommendationData(options);
  }
}

export async function fetchTrendsFromAI(): Promise<TrendAnalysis> {

  try {
    console.warn('fetchTrendsFromAI needs to be updated to use API route proxy.');
    throw new Error('API route for trends not implemented yet');
  } catch(error) {
    console.error('Error fetching trends:', error);
    console.log('Using mock data as fallback (fetchTrendsFromAI)');
    return getMockTrendData();
  }
}

export async function fetchTemplatesFromAI(options: {
  keywords?: string[];
  themes?: string[];
  count?: number;
} = {}): Promise<Template[]> {

  try {
    console.warn('fetchTemplatesFromAI needs to be updated to use API route proxy.');
     throw new Error('API route for templates not implemented yet');
  } catch (error) {
    console.error('Error fetching templates:', error);
    console.log('Using mock data as fallback (fetchTemplatesFromAI)');
    return getMockTemplates(options);
  }
}

function getMockTrendData(): TrendAnalysis {
  return {
    keywords: [ { text: 'NFT', value: 30 }, { text: 'Web3', value: 25 }, { text: 'ZORA', value: 22 }, { text: '仮想通貨', value: 20 }, { text: 'ミーム', value: 18 }, { text: 'AI生成', value: 15 }, { text: 'クリプトアート', value: 12 }, { text: 'メタバース', value: 10 }, { text: 'ジェネラティブ', value: 9 }, { text: 'コレクション', value: 8 }, ],
    themes: [ { name: 'サイバーパンク', popularity: 0.8 }, { name: 'レトロ風アート', popularity: 0.75 }, { name: '日本のアニメスタイル', popularity: 0.7 }, { name: 'ミニマリスト', popularity: 0.65 }, { name: '抽象的なデジタルアート', popularity: 0.6 }, ],
    colorPalettes: [ { name: 'ネオン', colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF00AA'] }, { name: 'パステル', colors: ['#FFD1DC', '#FFECF1', '#A2D2FF', '#EFD3FF'] }, { name: 'レトロ', colors: ['#F4A460', '#4682B4', '#B22222', '#DAA520'] }, ],
    visualStyles: [ { name: 'ピクセルアート', examples: ['https://example.com/pixel1.jpg'] }, { name: 'グリッチアート', examples: ['https://example.com/glitch1.jpg'] }, { name: '3Dレンダリング', examples: ['https://example.com/3d1.jpg'] }, { name: '手描き風', examples: ['https://example.com/hand1.jpg'] }, { name: '平面デザイン', examples: ['https://example.com/flat1.jpg'] }, ],
    updatedAt: new Date().toISOString()
  };
}
function getMockRecommendationData(options: { keywords?: string[]; style?: string; count?: number; }) {
  const style = options.style || 'ピクセルアート';
  const keywordsText = options.keywords?.join(', ') || 'NFT, Web3, クリプトアート';
  return {
    templates: getMockTemplates({ keywords: options.keywords, count: options.count }),
    prompts: [ `サイバーパンクな都市風景、ネオンの光、${keywordsText}、高層ビル、未来的`, `抽象的な${style}アート、鮮やかな色彩、${keywordsText}、流動的なフォルム`, `${style}風の風景、デジタルアート、${keywordsText}、高品質、詳細` ]
  };
}
function getMockTemplates(options: { keywords?: string[]; themes?: string[]; count?: number; } = {}): Template[] {
  const count = options.count || 5;
  const keywordsText = options.keywords?.join(', ') || 'NFT, Web3, クリプトアート';
  const templates: Template[] = [ { id: 'template-cyber-1', name: 'サイバーパンク デザイン', description: '鮮やかな色彩とテクノロジー感あふれるデザイン', imageUrl: '/images/templates/cyber-1.png', tags: ['サイバーパンク', '未来的', 'テック'], aiPrompt: `サイバーパンクな世界、${keywordsText}、ネオンの光、未来都市` }, { id: 'template-abstract-1', name: '抽象的 アート', description: '幾何学的な形状と複雑なパターンを用いた抽象的なデザイン', imageUrl: '/images/templates/abstract-1.png', tags: ['抽象', 'パターン', 'カラフル'], aiPrompt: `抽象的なデジタルアート、${keywordsText}、幾何学模様、波状のパターン` }, { id: 'template-anime-1', name: 'アニメ風 イラスト', description: '日本のアニメスタイルを取り入れたカラフルなイラスト', imageUrl: '/images/templates/anime-1.png', tags: ['アニメ', 'イラスト', 'カラフル'], aiPrompt: `アニメスタイルのイラスト、${keywordsText}、鮮やかな色彩、2Dスタイル` }, { id: 'template-minimal-1', name: 'ミニマル デザイン', description: 'シンプルで洗練されたミニマルデザイン', imageUrl: '/images/templates/minimal-1.png', tags: ['ミニマル', 'シンプル', '洗練'], aiPrompt: `ミニマルなデザイン、${keywordsText}、シンプル、余白、少ない色` }, { id: 'template-retro-1', name: 'レトロ スタイル', description: '80年代や90年代を思わせるレトロなデザイン', imageUrl: '/images/templates/retro-1.png', tags: ['レトロ', 'ビンテージ', 'ノスタルジック'], aiPrompt: `レトロスタイル、${keywordsText}、80年代、ビンテージ感、ノスタルジック` }, { id: 'template-pixel-1', name: 'ピクセルアート スタイル', description: 'ドット絵風のピクセルアートスタイル', imageUrl: '/images/templates/pixel-1.png', tags: ['ピクセルアート', 'レトロゲーム', '8ビット'], aiPrompt: `ピクセルアート、${keywordsText}、ドット絵、8ビットスタイル、レトロゲーム` } ];
  return templates.slice(0, Math.min(count, templates.length));
}
