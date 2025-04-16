import { NextRequest, NextResponse } from 'next/server';
import { prepareMetadata } from '@/lib/zora';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const content = formData.get('content') as File | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const symbol = formData.get('symbol') as string | null;
    const creatorAddress = formData.get('creatorAddress') as string | null;

    if (!content || !title || !description || !symbol || !creatorAddress) {
      return NextResponse.json(
        { success: false, error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    const metadataURI = await prepareMetadata(content, title, description);

    return NextResponse.json({
      success: true,
      metadataURI,
      title,
      symbol,
      description,
      creatorAddress,
    });
  } catch (error) {
    console.error('❌ create-coin route error:', error);
    return NextResponse.json(
      { success: false, error: 'メタデータの準備に失敗しました' },
      { status: 500 }
    );
  }
}
