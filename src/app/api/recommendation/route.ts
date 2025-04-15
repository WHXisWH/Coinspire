export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { fetchRecommendationsFromAI } from '@/lib/ai';

/**
 * AIベースのレコメンデーションを提供するAPIエンドポイント
 * クエリパラメータ:
 * - keywords: カンマ区切りのキーワードリスト
 * - style: 希望するスタイル
 * - count: 返すテンプレート/プロンプトの数
 */
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get('keywords')?.split(',') || [];
    const style = searchParams.get('style') || undefined;
    const count = parseInt(searchParams.get('count') || '5', 10);
    
    // 環境フラグをチェック
    const enableAIFeatures = process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES !== 'false';
    
    if (!enableAIFeatures) {
      console.log('AI features are disabled. Returning static recommendation data.');
      return getStaticRecommendation(keywords, style, count);
    }
    
    // AIサービスからレコメンデーションを取得
    const recommendations = await fetchRecommendationsFromAI({
      keywords,
      style,
      count
    });
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in recommendation API route:', error);
    
    // エラー時はモックデータを返す
    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get('keywords')?.split(',') || [];
    const style = searchParams.get('style') || undefined;
    const count = parseInt(searchParams.get('count') || '5', 10);
    
    return getStaticRecommendation(keywords, style, count);
  }
}

/**
 * モックレコメンデーションデータを生成
 */
function getStaticRecommendation(
  keywords: string[] = [], 
  style?: string,
  count: number = 5
) {
  const keywordsText = keywords.length > 0 
    ? keywords.join(', ') 
    : 'NFT, Web3, クリプトアート';
  
  const styleText = style || 'デジタル';
  
  // ベーステンプレート
  const baseTemplates = [
    {
      id: 'template-cyber-1',
      name: `${styleText} デザイン`,
      description: '鮮やかな色彩とテクノロジー感あふれるデザイン',
      imageUrl: '/images/templates/cyber-1.png',
      tags: ['サイバー', '未来的', 'テック'],
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
    }
  ];
  
  // ベースプロンプト
  const basePrompts = [
    `サイバーパンクな都市風景、ネオンの光、${keywordsText}、高層ビル、未来的`,
    `抽象的な${styleText}アート、鮮やかな色彩、${keywordsText}、流動的なフォルム`,
    `${styleText}風の風景、デジタルアート、${keywordsText}、高品質、詳細`,
    `ミニマルな${styleText}デザイン、シンプル、${keywordsText}、洗練された、少ない色`,
    `レトロな${styleText}スタイル、ビンテージ感、${keywordsText}、80年代、ノスタルジック`,
    `日本のアニメスタイル、${keywordsText}、鮮やかな色彩、2Dイラスト、カラフル`,
    `フラットデザイン、${keywordsText}、モダン、シンプル、明るい色彩`
  ];
  
  // カウント数に応じてテンプレートとプロンプトを返す
  const templates = baseTemplates.slice(0, Math.min(count, baseTemplates.length));
  const prompts = basePrompts.slice(0, Math.min(count, basePrompts.length));
  
  return NextResponse.json({ templates, prompts });
}
