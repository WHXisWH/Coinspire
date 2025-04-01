import { NFTStorage } from 'nft.storage';

// NFT.Storage クライアント初期化
const client = new NFTStorage({ 
  token: process.env.NFT_STORAGE_API_KEY || '' 
});

/**
 * ファイルをIPFSにアップロード
 * @param file アップロードするファイル
 * @returns CID
 */
export async function uploadToIPFS(file: File | Blob): Promise<string> {
  try {
    // バイナリファイルをIPFSにアップロード
    const cid = await client.storeBlob(file);
    return cid;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

/**
 * JSONオブジェクトをIPFSにアップロード
 * @param json アップロードするJSON
 * @returns CID
 */
export async function uploadJSONToIPFS(json: object): Promise<string> {
  try {
    // JSONをBlobに変換
    const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
    
    // IPFSにアップロード
    const cid = await client.storeBlob(blob);
    return cid;
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw new Error("Failed to upload JSON to IPFS");
  }
}

/**
 * IPFSのURLを外部アクセス可能なURLに変換
 * @param ipfsUrl ipfs://で始まるURL
 * @returns HTTPSゲートウェイURL
 */
export function ipfsToHttps(ipfsUrl: string): string {
  if (!ipfsUrl) return '';
  
  // ipfs://CIDの形式からHTTPSゲートウェイURLに変換
  if (ipfsUrl.startsWith('ipfs://')) {
    const cid = ipfsUrl.replace('ipfs://', '');
    return `https://nftstorage.link/ipfs/${cid}`;
  }
  
  return ipfsUrl;
}
