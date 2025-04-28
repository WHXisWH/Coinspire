import { NFTStorage } from 'nft.storage';

// IPFSゲートウェイのリスト
const IPFS_GATEWAYS = [
  'https://nftstorage.link/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
];

// 最大リトライ回数
const MAX_RETRIES = 3;

/**
 * リトライロジックを持つファイルアップロード
 * @param file アップロードするファイル
 * @returns CID
 */
export async function uploadToIPFS(file: File | Blob): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const client = new NFTStorage({ 
        token: process.env.NFT_STORAGE_API_KEY || '' 
      });

      if (!process.env.NFT_STORAGE_API_KEY) {
        console.warn("NFT_STORAGE_API_KEY is missing in environment variables.");
      }

      console.log(`IPFS upload attempt ${attempt + 1}/${MAX_RETRIES}`);
      const cid = await client.storeBlob(file);
      console.log(`Successfully uploaded to IPFS with CID: ${cid}`);
      return cid;
    } catch (error) {
      console.error(`Upload attempt ${attempt + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // 最後の試行でなければ少し待ってから再試行
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 指数バックオフ
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error("Failed to upload file to IPFS after multiple attempts");
}

/**
 * JSON用のリトライロジックを持つアップロード
 */
export async function uploadJSONToIPFS(json: object): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const client = new NFTStorage({ 
        token: process.env.NFT_STORAGE_API_KEY || '' 
      });

      if (!process.env.NFT_STORAGE_API_KEY) {
        console.warn("NFT_STORAGE_API_KEY is missing in environment variables.");
      }

      console.log(`JSON IPFS upload attempt ${attempt + 1}/${MAX_RETRIES}`);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
      const cid = await client.storeBlob(blob);
      console.log(`Successfully uploaded JSON to IPFS with CID: ${cid}`);
      return cid;
    } catch (error) {
      console.error(`JSON upload attempt ${attempt + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error("Failed to upload JSON to IPFS after multiple attempts");
}

/**
 * 複数のゲートウェイを試行するIPFSのURL変換
 * @param ipfsUrl ipfs://で始まるURL
 * @returns HTTPSゲートウェイURL
 */
export function ipfsToHttps(ipfsUrl: string): string {
  if (!ipfsUrl) return '';

  if (ipfsUrl.startsWith('ipfs://')) {
    const cid = ipfsUrl.replace('ipfs://', '');
    
    // デフォルトゲートウェイを返すが、クライアント側でfallbackできるように
    // data-ipfs-fallbacks属性もHTMLに追加できるようにする
    return `${IPFS_GATEWAYS[0]}${cid}`;
  }

  return ipfsUrl;
}

/**
 * すべてのIPFSゲートウェイを取得（クライアントでの代替ゲートウェイ使用のため）
 */
export function getIpfsGateways(): string[] {
  return IPFS_GATEWAYS;
}