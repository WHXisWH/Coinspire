'use client';

import { useMemo, useState } from 'react';
import type { Keyword } from '@/types/trends';

interface KeywordCloudProps {
  keywords: Keyword[];
}

export function KeywordCloud({ keywords }: KeywordCloudProps) {
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);
  
  // キーワードがない場合
  if (!keywords || keywords.length === 0) {
    return (
      <div className="empty-state text-center p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <p className="mt-2 text-gray-500 dark:text-gray-400">キーワードデータがありません</p>
      </div>
    );
  }
  
  // キーワードをシャッフル
  const shuffledKeywords = useMemo(() => {
    return [...keywords].sort(() => Math.random() - 0.5);
  }, [keywords]);
  
  // 最大値を取得（フォントサイズの計算用）
  const maxValue = Math.max(...shuffledKeywords.map((keyword: Keyword) => keyword.value));
  
  return (
    <div className="keyword-cloud flex flex-wrap justify-center gap-3 p-4 relative">
      {shuffledKeywords.map((keyword: Keyword) => {
        // 相対的なフォントサイズを計算（1.0〜2.5em）
        const fontSize = 1.0 + (keyword.value / maxValue) * 1.5;
        
        // 重要度に応じた色の強度を設定
        const colorIntensity = Math.floor((keyword.value / maxValue) * 600);
        const isHovered = hoveredKeyword === keyword.text;
        
        return (
          <div 
            key={keyword.text}
            className="relative"
            onMouseEnter={() => setHoveredKeyword(keyword.text)}
            onMouseLeave={() => setHoveredKeyword(null)}
          >
            <span
              className={`inline-block px-2 py-1 cursor-pointer transition-all duration-200 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-${Math.min(Math.max(colorIntensity, 500), 800)}`}
              style={{ 
                fontSize: `${fontSize}em`,
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                zIndex: isHovered ? 10 : 1,
              }}
              title={`${keyword.text}: ${keyword.value}`}
            >
              {keyword.text}
            </span>
            
            {isHovered && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap">
                出現回数: {keyword.value}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}