import axios from 'axios';

/**
 * APIリクエスト用のベースインスタンス
 */
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * AIサービスへのリクエスト用インスタンス
 */
export const aiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_SERVICE_URL || '/api/ai',
  headers: {
    'Content-Type': 'application/json',
  },
});

// AIサービスのAPIキーがある場合は設定
if (process.env.NEXT_PUBLIC_AI_SERVICE_API_KEY) {
  aiApi.defaults.headers.common['X-API-Key'] = process.env.NEXT_PUBLIC_AI_SERVICE_API_KEY;
}

/**
 * トレンド分析データを取得
 */
export async function fetchTrends() {
  const response = await api.get('/trends');
  return response.data;
}

/**
 * レコメンデーションを取得
 * @param params 検索パラメータ
 */
export async function fetchRecommendations(params?: {
  keywords?: string[];
  style?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.keywords?.length) {
    queryParams.set('keywords', params.keywords.join(','));
  }
  
  if (params?.style) {
    queryParams.set('style', params.style);
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await api.get(`/recommendation${query}`);
  return response.data;
}

/**
 * IPFSにファイルをアップロード
 * @param file アップロードするファイル
 */
export async function uploadFileToIPFS(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/ipfs/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}

/**
 * IPFS URIに変換する
 * @param cid Content Identifier
 */
export function toIPFSUri(cid: string): string {
  if (!cid) return '';
  if (cid.startsWith('ipfs://')) return cid;
  return `ipfs://${cid}`;
}
