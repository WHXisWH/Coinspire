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

// メタデータ準備
export async function prepareMetadata(
  content: File | Blob,
  title: string,
  description: string
): Promise<string> {
  try {
    console.log(`Preparing metadata for: ${title}`);
    console.log(`Content type: ${content.type}, Size: ${content.size} bytes`);
    
    // コンテンツをIPFSにアップロード
    const contentCID = await uploadToIPFS(content);
    console.log(`Content uploaded to IPFS with CID: ${contentCID}`);
    
    // メタデータJSONを構築
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
      throw new Error(`メタデータが無効です: ${(error as Error).message}`);
    }
    
    // メタデータJSONをIPFSにアップロード
    const metadataCID = await uploadJSONToIPFS(metadata);
    console.log(`Metadata uploaded to IPFS with CID: ${metadataCID}`);
    
    return `ipfs://${metadataCID}`;
  } catch (error) {
    console.error("Error preparing metadata:", error);
    throw new Error(`メタデータの準備中にエラーが発生しました: ${(error as Error).message}`);
  }
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
  
  if (!walletClient || !walletClient.account) {
    console.error("Wallet client or account is missing");
    return {
      success: false,
      error: "ウォレットが接続されていません。ウォレットを接続してからもう一度お試しください。"
    };
  }

  if (!publicClient) {
    console.error("Public client is missing");
    return {
      success: false,
      error: "ネットワーク接続エラーが発生しました。ページをリロードして再試行してください。"
    };
  }
  
  try {
    console.log("Starting metadata preparation...");
    // メタデータを準備
    const metadataURI = await prepareMetadata(content, title, description);
    console.log("Metadata prepared successfully:", metadataURI);
    
    // プラットフォームリファラーアドレスがあれば使用
    const platformReferrer = process.env.NEXT_PUBLIC_PLATFORM_REFERRER_ADDRESS as Address || undefined;
    console.log("Platform referrer:", platformReferrer || "Not set");
    
    // Coinの作成パラメータ設定
    const createCoinParams: CreateCoinParams = {
      name: title,
      symbol: symbol,  // $記号は不要、SDKが処理
      uri: metadataURI,
      payoutRecipient: creatorAddress,
      platformReferrer
    };
    
    console.log("Creating coin with params:", {
      ...createCoinParams,
      creatorAddress: creatorAddress,
    });
    
    // Coin作成トランザクション実行
    const result = await createCoin(createCoinParams, walletClient, publicClient);
    console.log('✅ createCoin result:', result);
    
    if (!result || !result.hash) {
      console.error('Failed to create coin: No transaction hash returned');
      return {
        success: false,
        error: "トランザクションの作成に失敗しました。ネットワーク状態を確認してください。"
      };
    }
    
    return {
      success: true,
      hash: result.hash,
      address: result.address
    };
  } catch (error: any) {
    console.error("Error creating coin:", error);
    
    // エラーメッセージをユーザーフレンドリーにする
    let errorMessage = "コインの作成中にエラーが発生しました。";
    
    if (error.message) {
      if (error.message.includes("user rejected transaction")) {
        errorMessage = "ウォレットでトランザクションが拒否されました。";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "ウォレットに十分な資金がありません。";
      } else {
        errorMessage += ` ${error.message}`;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// トランザクション結果からコインアドレスを取得
export function extractCoinAddressFromReceipt(receipt: any): Address | undefined {
  try {
    if (!receipt) {
      console.error("Receipt is undefined or null");
      return undefined;
    }
    
    const coinDeployment = getCoinCreateFromLogs(receipt);
    console.log("Extract coin address from receipt:", coinDeployment);
    return coinDeployment?.coin;
  } catch (error) {
    console.error("Error extracting coin address from receipt:", error);
    return undefined;
  }
}

// Zoraから各種コインデータを取得する関数
export async function fetchCoinsData(endpoint: string, params?: Record<string, string>): Promise<CoinDetails[]> {
  try {
    const queryParams = new URLSearchParams(params || {});
    const apiUrl = `${endpoint}?${queryParams.toString()}`;
    
    console.log(`Fetching coin data from: ${apiUrl}`);
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

// トレンドコイン取得
export async function getTrendingCoins(count = 10): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/trending', { count: count.toString() });
}

// 新着コイン取得
export async function getNewCoins(count = 10): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/new', { count: count.toString() });
}

// ユーザーのコイン残高を取得
export async function getUserCoins(address: string): Promise<CoinDetails[]> {
  return fetchCoinsData('/api/coins/user', { address });
}

export {
  prepareMetadata,
  createContentCoin,
  extractCoinAddressFromReceipt,
  fetchCoinsData,
  getTrendingCoins,
  getNewCoins,
  getUserCoins,
};
