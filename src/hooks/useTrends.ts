import useSWR from 'swr';
import axios from 'axios';
import type { TrendAnalysis } from '@/types/trends';

// API URLの設定
const API_URL = '/api/trends';

// 空のトレンドデータ
const emptyTrends: TrendAnalysis = {
  keywords: [],
  themes: [],
  colorPalettes: [],
  visualStyles: []
};

// エラーを処理してデータを取得する関数
const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // API呼び出し失敗時は、ハードコードされたモックデータを返す
    if (url.includes('/trends')) {
      return {
        keywords: [
          { text: 'NFT', value: 30 },
          { text: 'Web3', value: 25 },
          { text: 'ZORA', value: 22 },
          { text: '仮想通貨', value: 20 },
          { text: 'ミーム', value: 18 },
        ],
        themes: [
          { name: 'サイバーパンク', popularity: 0.8 },
          { name: 'レトロ風アート', popularity: 0.75 },
          { name: '日本のアニメスタイル', popularity: 0.7 },
        ],
        colorPalettes: [
          { name: 'ネオン', colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF00AA'] },
          { name: 'パステル', colors: ['#FFD1DC', '#FFECF1', '#A2D2FF', '#EFD3FF'] },
        ],
        visualStyles: [
          { name: 'ピクセルアート', examples: ['https://example.com/pixel1.jpg'] },
          { name: 'グリッチアート', examples: ['https://example.com/glitch1.jpg'] },
        ]
      };
    }
    throw error;
  }
};

/**
 * トレンドデータを取得するためのカスタムフック
 */
export function useTrends() {
  const { data, error, isLoading, mutate } = useSWR(API_URL, fetcher, {
    // 30分ごとに再検証
    refreshInterval: 30 * 60 * 1000,
    // 最大24時間キャッシュ
    dedupingInterval: 24 * 60 * 60 * 1000,
    // 失敗時の再試行
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // 5回まで再試行
      if (retryCount >= 5) return;
      // 5秒後に再試行
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
    // エラーが起きても古いデータは表示
    keepPreviousData: true,
    // 代替データ
    fallbackData: emptyTrends
  });

  return {
    trends: data || emptyTrends,
    isLoading,
    isError: error,
    refresh: mutate
  };
}

/**
 * レコメンデーションを取得するためのカスタムフック
 */
export function useRecommendations(keywords?: string[], style?: string) {
  // クエリパラメータ構築
  const queryParams = new URLSearchParams();
  
  if (keywords && keywords.length > 0) {
    queryParams.set('keywords', keywords.join(','));
  }
  
  if (style) {
    queryParams.set('style', style);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const apiUrl = `/api/recommendation${queryString}`;
  
  const { data, error, isLoading } = useSWR(
    keywords || style ? apiUrl : null,
    fetcher,
    {
      keepPreviousData: true,
      fallbackData: { templates: [], prompts: [] }
    }
  );
  
  return {
    recommendations: data || { templates: [], prompts: [] },
    isLoading,
    isError: error
  };
}
