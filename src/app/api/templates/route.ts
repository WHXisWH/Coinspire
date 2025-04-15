export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import type { Template } from '@/types/trends';

/**
 * テンプレートデータを提供するAPIエンドポイント
 */
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get('keywords')?.split(',') || [];
    const style = searchParams.get('style') || undefined;
    const count = parseInt(searchParams.get('count') || '10', 10);
    
    // 環境フラグをチェック
    const enableAIFeatures = process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES !== 'false';
    
    if (!enableAIFeatures) {
      console.log('AI features are disabled. Returning static template data.');
      return getStaticTemplates(keywords, style, count);
    }
    
    // ここでAIサービスからデータを取得する代わりに、静的なテンプレートを返します
    // 実際のプロダクションでは、AIサービスとの統合が必要です
    return getStaticTemplates(keywords, style, count);
  } catch (error) {
    console.error('Error in templates API route:', error);
    
    // エラー時はデフォルトのテンプレートを返す
    return getStaticTemplates();
  }
}

/**
 * 静的なテンプレートデータを生成
 */
function getStaticTemplates(
  keywords: string[] = [], 
  style?: string,
  count: number = 10
) {
  const keywordsText = keywords.length > 0 
    ? keywords.join(', ') 
    : 'NFT, Web3, クリプトアート';
    
  const styleText = style || 'デジタル';
  
  // ベーステンプレート
  const templates: Template[] = [
    {
      id: 'template-cyber-1',
      name: `${styleText} サイバーパンク`,
      description: '鮮やかな色彩とテクノロジー感あふれるデザイン',
      imageUrl: '/images/templates/cyber-1.png',
      tags: ['サイバーパンク', '未来的', 'テック'],
      aiPrompt: `サイバーパンクな世界、${keywordsText}、ネオンの光、未来都市`
    },
    {
      id: 'template-abstract-1',
      name: `抽象的 アート`,
      description: '幾何学的な形状と複雑なパターンを用いた抽象的なデザイン',
      imageUrl: '/images/templates/abstract-1.png',
      tags: ['抽象', 'パターン', 'カラフル'],
      aiPrompt: `抽象的なデジタルアート、${keywordsText}、幾何学模様、波状のパターン`
    },
    {
      id: 'template-anime-1',
      name: `アニメ風 イラスト`,
      description: '日本のアニメスタイルを取り入れたカラフルなイラスト',
      imageUrl: '/images/templates/anime-1.png',
      tags: ['アニメ', 'イラスト', 'カラフル'],
      aiPrompt: `アニメスタイルのイラスト、${keywordsText}、鮮やかな色彩、2Dスタイル`
    },
    {
      id: 'template-minimal-1',
      name: `ミニマル デザイン`,
      description: 'シンプルで洗練されたミニマルデザイン',
      imageUrl: '/images/templates/minimal-1.png',
      tags: ['ミニマル', 'シンプル', '洗練'],
      aiPrompt: `ミニマルなデザイン、${keywordsText}、シンプル、余白、少ない色`
    },
    {
      id: 'template-retro-1',
      name: `レトロ スタイル`,
      description: '80年代や90年代を思わせるレトロなデザイン',
      imageUrl: '/images/templates/retro-1.png',
      tags: ['レトロ', 'ビンテージ', 'ノスタルジック'],
      aiPrompt: `レトロスタイル、${keywordsText}、80年代、ビンテージ感、ノスタルジック`
    },
    {
      id: 'template-pixel-1',
      name: `ピクセルアート`,
      description: 'ドット絵風のレトロなピクセルアート',
      imageUrl: '/images/templates/pixel-1.png', 
      tags: ['ピクセルアート', 'レトロゲーム', '8ビット'],
      aiPrompt: `ピクセルアート、${keywordsText}、ドット絵、8ビットスタイル、レトロゲーム`
    }
  ];
  
  // スタイルでフィルタリング（指定がある場合）
  let filteredTemplates = templates;
  if (style) {
    filteredTemplates = templates.filter(template => 
      template.name.toLowerCase().includes(style.toLowerCase()) || 
      template.tags.some(tag => tag.toLowerCase().includes(style.toLowerCase()))
    );
    
    // フィルタリングの結果が0件の場合は全てのテンプレートを返す
    if (filteredTemplates.length === 0) {
      filteredTemplates = templates;
    }
  }
  
  // カウント数に応じてテンプレートを返す
  const limitedTemplates = filteredTemplates.slice(0, Math.min(count, filteredTemplates.length));
  
  return NextResponse.json(limitedTemplates, { 
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    }
  });
}
