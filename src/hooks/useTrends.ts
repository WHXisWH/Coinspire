import useSWR from 'swr';
import type { TrendAnalysis } from '@/types/trends';
import { fetchTrends } from '@/utils/api';

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

/**
 * トレンドデータを取得するためのカスタムフック
 */
export function useTrends() {
  const { data, error, isLoading, mutate } = useSWR('/api/trends', fetchTrends, {
    refreshInterval: 30 * 60 * 1000, // 30分
    dedupingInterval: 24 * 60 * 60 * 1000, // 最大24時間
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
    revalidateOnFocus: false,
    keepPreviousData: true,
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
  const queryParams = new URLSearchParams();

  if (keywords?.length) {
    queryParams.set('keywords', keywords.join(','));
  }

  if (style) {
    queryParams.set('style', style);
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const apiUrl = `/api/recommendation${queryString}`;

  const { data, error, isLoading } = useSWR(
    keywords || style ? apiUrl : null,
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return await response.json();
    },
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
