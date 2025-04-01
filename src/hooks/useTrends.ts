import useSWR from 'swr';
import axios from 'axios';
import type { TrendAnalysis } from '@/types/trends';

// API URLの設定
const API_URL = '/api/trends';

/**
 * トレンドデータを取得するためのカスタムフック
 */
export function useTrends() {
  const fetcher = async (): Promise<TrendAnalysis> => {
    const response = await axios.get(API_URL);
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR('trends', fetcher, {
    // 30分ごとに再検証
    refreshInterval: 30 * 60 * 1000,
    // 最大24時間キャッシュ
    dedupingInterval: 24 * 60 * 60 * 1000,
  });

  return {
    trends: data || {
      keywords: [],
      themes: [],
      colorPalettes: [],
      visualStyles: []
    },
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
  
  const fetcher = async () => {
    const response = await axios.get(apiUrl);
    return response.data;
  };
  
  const { data, error, isLoading } = useSWR(
    keywords || style ? apiUrl : null,
    fetcher
  );
  
  return {
    recommendations: data || { templates: [], prompts: [] },
    isLoading,
    isError: error
  };
}
