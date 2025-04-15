'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchRecommendationsFromAI, fetchTemplatesFromAI } from '@/lib/ai';
import type { TrendAnalysis, Template } from '@/types/trends';

interface TemplateGalleryProps {
  trends: TrendAnalysis;
  onSelect: (templateId: string, template: Template) => void;
}

export function TemplateGallery({ trends, onSelect }: TemplateGalleryProps) {
  const [filter, setFilter] = useState<string>('all');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // トレンドが変更されたときにテンプレートを更新
  useEffect(() => {
    async function fetchTemplates() {
      try {
        setIsLoading(true);
        setError(null);
        
        // トレンドデータからキーワードを抽出
        const keywords = trends.keywords.slice(0, 5).map(k => k.text);
        
        // テーマを抽出
        const themes = trends.themes.slice(0, 3).map(t => t.name);
        
        // 両方の方法でテンプレートを取得してみる
        let templateResults: Template[] = [];
        
        // 方法1: レコメンデーションAPIから取得
        try {
          const response = await fetchRecommendationsFromAI({
            keywords,
            count: 10
          });
          
          if (response && response.templates && response.templates.length > 0) {
            templateResults = response.templates;
          }
        } catch (recError) {
          console.error('Failed to fetch from recommendation API:', recError);
        }
        
        // まだテンプレートがなければ、直接テンプレートAPIを試す
        if (templateResults.length === 0) {
          try {
            const directTemplates = await fetchTemplatesFromAI({
              keywords,
              themes,
              count: 10
            });
            
            if (directTemplates && directTemplates.length > 0) {
              templateResults = directTemplates;
            }
          } catch (directError) {
            console.error('Failed to fetch from templates API:', directError);
          }
        }
        
        // それでもなければ、フォールバックテンプレートを生成
        if (templateResults.length === 0) {
          templateResults = generateMockTemplates(trends);
        }
        
        setTemplates(templateResults);
      } catch (err) {
        console.error('Failed to fetch templates:', err);
        setError('テンプレートの取得に失敗しました');
        // エラー時はモックデータで対応
        setTemplates(generateMockTemplates(trends));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTemplates();
  }, [trends]);
  
  // フィルタリングされたテンプレート
  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(template => template.tags.includes(filter));
  
  // トレンドからタグリストを生成
  const trendTags = [
    ...new Set([
      ...trends.themes.map((theme) => theme.name),
      ...trends.visualStyles.map((style) => style.name)
    ])
  ];
  
  // スタイル別のテンプレート取得
  const handleStyleFilter = async (style: string) => {
    setFilter(style);
    
    // スタイルが「全て」以外の場合、そのスタイルに特化したテンプレートを取得
    if (style !== 'all') {
      try {
        setIsLoading(true);
        
        // トレンドデータからキーワードを抽出
        const keywords = trends.keywords.slice(0, 3).map(k => k.text);
        
        // AIサービスから特定スタイルのテンプレートを取得
        const response = await fetchRecommendationsFromAI({
          keywords,
          style,
          count: 6
        });
        
        if (response && response.templates && response.templates.length > 0) {
          // 既存のテンプレートと統合
          const existingTemplates = templates.filter(t => !t.tags.includes(style));
          const newTemplates = response.templates;
          setTemplates([...newTemplates, ...existingTemplates]);
        }
      } catch (error) {
        console.error('Failed to fetch style-specific templates:', error);
        // エラー処理はここで行わない - 既存のテンプレートをそのまま表示する
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="template-gallery">
      {/* フィルターセクション */}
      <div className="filter-section mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          すべて
        </button>
        
        {trendTags.map((tag: string) => (
          <button
            key={tag}
            onClick={() => handleStyleFilter(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {/* ローディング表示 */}
      {isLoading && (
        <div className="loading-state text-center py-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            テンプレートを読み込み中...
          </div>
        </div>
      )}
      
      {/* エラー表示 */}
      {error && !isLoading && templates.length === 0 && (
        <div className="error-state text-center py-6 px-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md mb-6">
          <p>{error}</p>
          <button 
            className="mt-2 text-sm underline" 
            onClick={() => setTemplates(generateMockTemplates(trends))}
          >
            デフォルトテンプレートを表示
          </button>
        </div>
      )}
      
      {/* テンプレートグリッド */}
      <div className="template-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template: Template) => (
          <div
            key={template.id}
            className="template-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelect(template.id, template)}
          >
            <div className="relative h-48">
              {template.imageUrl && (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {template.imageUrl.startsWith('/') ? (
                    // 内部の静的画像の場合
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    // 外部画像の場合はフォールバック表示
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {template.description}
              </p>

              
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags && template.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && !isLoading && (
        <div className="empty-state text-center p-10">
          <p className="text-gray-500 dark:text-gray-400">
            このフィルターに一致するテンプレートが見つかりませんでした。
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * モックテンプレートを生成
 */
function generateMockTemplates(trends: TrendAnalysis): Template[] {
  // トレンドからデータを抽出
  const themes = trends.themes.slice(0, 3).map(t => t.name);
  const styles = trends.visualStyles.slice(0, 3).map(s => s.name);
  const keywords = trends.keywords.slice(0, 5).map(k => k.text);
  
  // モックテンプレート
  return [
    {
      id: 'template-cyber-1',
      name: `${styles[0] || 'サイバー'} デザイン`,
      description: '鮮やかな色彩とテクノロジー感あふれるデザイン',
      imageUrl: '/images/templates/cyber-1.png',
      tags: [themes[0] || 'サイバーパンク', '未来的', 'テック'],
      aiPrompt: `${themes[0] || 'サイバーパンク'}な世界、${keywords.slice(0, 3).join('、')}、ネオンの光、未来都市`
    },
    {
      id: 'template-abstract-1',
      name: `抽象的 アート`,
      description: '幾何学的な形状と複雑なパターンを用いた抽象的なデザイン',
      imageUrl: '/images/templates/abstract-1.png',
      tags: [themes[1] || '抽象', 'パターン', 'カラフル'],
      aiPrompt: `抽象的なデジタルアート、${keywords.slice(0, 3).join('、')}、幾何学模様、波状のパターン`
    },
    {
      id: 'template-anime-1',
      name: `アニメ風 イラスト`,
      description: '日本のアニメスタイルを取り入れたカラフルなイラスト',
      imageUrl: '/images/templates/anime-1.png',
      tags: [themes[2] || 'アニメ', 'イラスト', 'カラフル'],
      aiPrompt: `アニメスタイルのイラスト、${keywords.slice(0, 3).join('、')}、鮮やかな色彩、2Dスタイル`
    },
    {
      id: 'template-minimal-1',
      name: `ミニマル デザイン`,
      description: 'シンプルで洗練されたミニマルデザイン',
      imageUrl: '/images/templates/minimal-1.png',
      tags: ['ミニマル', 'シンプル', '洗練'],
      aiPrompt: `ミニマルなデザイン、${keywords.slice(0, 3).join('、')}、シンプル、余白、少ない色`
    },
    {
      id: 'template-retro-1',
      name: `レトロ スタイル`,
      description: '80年代や90年代を思わせるレトロなデザイン',
      imageUrl: '/images/templates/retro-1.png',
      tags: ['レトロ', 'ビンテージ', 'ノスタルジック'],
      aiPrompt: `レトロスタイル、${keywords.slice(0, 3).join('、')}、80年代、ビンテージ感、ノスタルジック`
    }
  ];
}
