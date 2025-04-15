import { 
  createCoin, 
  createCoinCall,
  getCoinCreateFromLogs,
  setApiKey,
  validateMetadataJSON
} from "@zoralabs/coins-sdk";
import type { CreateCoinParams, CoinDetails } from "@/types/zora";
import { uploadToIPFS, uploadJSONToIPFS } from './ipfs';
import { Address } from "viem";

// APIキーがあれば設定する
if (process.env.ZORA_API_KEY) {
  setApiKey(process.env.ZORA_API_KEY);
}

// メタデータ準備
export async function prepareMetadata(
  content: File | Blob,
  title: string,
  description: string
): Promise<string> {
  // コンテンツをIPFSにアップロード
  const contentCID = await uploadToIPFS(content);
  
  // メタデータJSONを作成
  const metadata = {
    name: title,
    description: description,
    image: `ipfs://${contentCID}`,
    content: {
      mime: content.type,
      uri: `ipfs://${contentCID}`
    },
    properties: {
      category: "social" // カテゴリを追加（EIP-7572準拠）
    }
  };
  
  // メタデータをバリデーション
  try {
    validateMetadataJSON(metadata);
  } catch (error) {
    console.error("Metadata validation error:", error);
    throw new Error("メタデータが無効です: " + (error as Error).message);
  }
  
  // メタデータJSONをIPFSにアップロード
  const metadataCID = await uploadJSONToIPFS(metadata);
  
  return `ipfs://${metadataCID}`;
}

// Coin作成関数
export async function createContentCoin(
  walletClient: any, 
  publicClient: any, 
  contentData: {
    content: File | Blob;
    title: string;
    symbol: string;
    description: string;
    creatorAddress: Address;
  }
): Promise<{
  success: boolean;
  hash?: string;
  address?: Address;
  error?: string;
}> {
  const { content, title, symbol, description, creatorAddress } = contentData;
  
  try {
    // メタデータを準備
    const metadataURI = await prepareMetadata(content, title, description);
    
    // Coinの作成パラメータ設定
    const createCoinParams: CreateCoinParams = {
      name: title,
      symbol: symbol,  // $記号は不要、SDKが処理
      uri: metadataURI,
      payoutRecipient: creatorAddress,
      // プラットフォーム報酬を受け取るためのアドレス
      platformReferrer: process.env.NEXT_PUBLIC_PLATFORM_REFERRER_ADDRESS as Address || undefined,
    };
    
    // Coin作成トランザクション実行
    const result = await createCoin(createCoinParams, walletClient, publicClient);
    console.log('✅ createCoin result:', result);
    
    return {
      success: true,
      hash: result.hash,
      address: result.address
    };
  } catch (error: any) {
    console.error("Error creating coin:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// トランザクション結果からコインアドレスを取得
export function extractCoinAddressFromReceipt(receipt: any): Address | undefined {
  const coinDeployment = getCoinCreateFromLogs(receipt);
  return coinDeployment?.coin;
}

// Zoraから取得できる実際のコインデータをAPIから取得
export async function fetchCoinsData(endpoint: string, params?: Record<string, string>): Promise<CoinDetails[]> {
  try {
    const queryParams = new URLSearchParams(params);
    const apiUrl = `${endpoint}?${queryParams.toString()}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
}

// トレンドコイン取得 (APIが利用可能な場合実装)
export async function getTrendingCoins(count = 10): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/trending', { count: count.toString() });
}

// 新着コイン取得 (APIが利用可能な場合実装)
export async function getNewCoins(count = 10): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/new', { count: count.toString() });
}

// ユーザーのコイン残高を取得
export async function getUserCoins(address: string): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/user', { address });
}
