'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { TrendAnalysis, Template } from '@/types/trends';

interface TemplateGalleryProps {
  trends: TrendAnalysis;
  onSelect: (templateId: string) => void;
}

export function TemplateGallery({ trends, onSelect }: TemplateGalleryProps) {
  const [filter, setFilter] = useState<string>('all');
  
  // トレンドからモックテンプレートを生成
  // 実際のアプリではAPIから取得する形に変更
  const mockTemplates: Template[] = [
    {
      id: 'template-1',
      name: 'ネオンサイバーパンク',
      description: '鮮やかなネオンカラーとサイバーパンク風の未来都市をテーマにしたスタイル',
      imageUrl: '/templates/cyber.jpg',
      tags: ['サイバーパンク', 'ネオン', '未来的'],
      aiPrompt: 'サイバーパンクな世界、ネオンの光、未来都市、夜景、高層ビル'
    },
    {
      id: 'template-2',
      name: 'アニメスタイル',
      description: '日本のアニメを思わせる鮮やかなキャラクターデザイン',
      imageUrl: '/templates/anime.jpg',
      tags: ['アニメ', 'カラフル', 'キャラクター'],
      aiPrompt: '日本のアニメスタイル、鮮やかな色彩、かわいいキャラクター、2Dイラスト'
    },
    {
      id: 'template-3',
      name: 'ミニマリストデザイン',
      description: 'シンプルで洗練されたミニマリストスタイル、抽象的な要素を取り入れたデザイン',
      imageUrl: '/templates/minimal.jpg',
      tags: ['ミニマリスト', 'シンプル', '抽象的'],
      aiPrompt: 'ミニマリスト、シンプルデザイン、抽象的形状、少ない色、空白、余白、洗練'
    },
    // 実際のトレンドからモック生成するロジックをここに追加
  ];
  
  // フィルタリングされたテンプレート
  const filteredTemplates = filter === 'all' 
    ? mockTemplates 
    : mockTemplates.filter(template => template.tags.includes(filter));
  
  // トレンドからタグリストを生成
  const trendTags = [
    ...new Set([
      ...trends.themes.map(theme => theme.name),
      ...trends.visualStyles.map(style => style.name)
    ])
  ];
  
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
        
        {trendTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
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
      
      {/* テンプレートグリッド */}
      <div className="template-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="template-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelect(template.id)}
          >
            <div className="relative h-48">
              <Image
                src={template.imageUrl}
                alt={template.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.map(tag => (
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
      
      {filteredTemplates.length === 0 && (
        <div className="empty-state text-center p-10">
          <p className="text-gray-500 dark:text-gray-400">
            このフィルターに一致するテンプレートが見つかりませんでした。
          </p>
        </div>
      )}
    </div>
  );
}
