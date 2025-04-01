import { NextRequest, NextResponse } from 'next/server';
import { uploadToIPFS } from '@/lib/ipfs';

// 最大ファイルサイズ (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }
    
    // ファイルサイズチェック
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 }
      );
    }
    
    // ファイルタイプチェック
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '無効なファイル形式です。JPEG, PNG, GIF形式のみ対応しています' },
        { status: 400 }
      );
    }
    
    // IPFSにアップロード
    const cid = await uploadToIPFS(file);
    
    return NextResponse.json({ 
      success: true, 
      cid,
      url: `ipfs://${cid}`
    });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    
    return NextResponse.json(
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
}
