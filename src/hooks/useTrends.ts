import useSWR from 'swr';
import type { TrendAnalysis } from '@/types/trends';

// API URLの設定
const API_URL = '/api/trends';

// 静的なフォールバックデータ
const fallbackTrends: TrendAnalysis = {
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

// SWR用フェッチャー関数
const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    // エラー時はフォールバックデータを返す
    if (url.includes('/trends')) {
      return fallbackTrends;
    }
    // その他のURLの場合はエラーを投げる
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
    // 失敗時の再試行設定
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // 3回まで再試行
      if (retryCount >= 3) return;
      // 5秒後に再試行
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
    // フォーカス時に再検証しない
    revalidateOnFocus: false,
    // エラーが起きても古いデータは表示
    keepPreviousData: true,
    // 初期値としてのフォールバックデータ
    fallbackData: fallbackTrends
  });

  return {
    trends: data || fallbackTrends,
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
      revalidateOnFocus: false,
      fallbackData: { templates: [], prompts: [] }
    }
  );
  
  return {
    recommendations: data || { templates: [], prompts: [] },
    isLoading,
    isError: error
  };
}
