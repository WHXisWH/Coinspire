import { 
  createCoin, 
  createCoinCall,
  getCoinCreateFromLogs,
  setApiKey 
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
    }
  };
  
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

// トレンドコイン取得 (APIが利用可能な場合実装)
export async function getTrendingCoins(count = 10): Promise<CoinDetails[]> {
  try {
    // Zora SDKやAPIからトレンドコインを取得する実装
    // この部分は実際のAPIが提供されている場合に実装
    // 現在はモックデータを返す
    const mockCoins: CoinDetails[] = [
      {
        id: '1',
        name: 'Example Coin 1',
        description: 'This is an example trending coin',
        address: '0x1234567890123456789012345678901234567890',
        symbol: 'EXC1',
        createdAt: new Date().toISOString(),
        creatorAddress: '0x0987654321098765432109876543210987654321',
        marketCap: '10000',
        volume24h: '5000',
        mediaUrl: 'ipfs://example-media-cid',
        imageUrl: 'ipfs://example-image-cid',
      },
      // その他のモックデータ
    ];
    
    return mockCoins;
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    return [];
  }
}

// 新着コイン取得 (APIが利用可能な場合実装)
export async function getNewCoins(count = 10): Promise<CoinDetails[]> {
  try {
    // Zora SDKやAPIから新着コインを取得する実装
    // この部分は実際のAPIが提供されている場合に実装
    // 現在はモックデータを返す
    const mockCoins: CoinDetails[] = [
      {
        id: '2',
        name: 'New Coin 1',
        description: 'This is a new coin example',
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        symbol: 'NEW1',
        createdAt: new Date().toISOString(),
        creatorAddress: '0xfedcba0987654321fedcba0987654321fedcba09',
        marketCap: '5000',
        volume24h: '1000',
        mediaUrl: 'ipfs://example-new-media-cid',
        imageUrl: 'ipfs://example-new-image-cid',
      },
      // その他のモックデータ
    ];
    
    return mockCoins;
  } catch (error) {
    console.error("Error fetching new coins:", error);
    return [];
  }
}
