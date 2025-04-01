'use client';

import { useMemo } from 'react';
import type { Keyword } from '@/types/trends';

interface KeywordCloudProps {
  keywords: Keyword[];
}

export function KeywordCloud({ keywords }: KeywordCloudProps) {
  // キーワードがない場合
  if (!keywords || keywords.length === 0) {
    return (
      <div className="empty-state text-center p-6 text-gray-500 dark:text-gray-400">
        キーワードデータがありません
      </div>
    );
  }
  
  // キーワードをシャッフル
  const shuffledKeywords = useMemo(() => {
    return [...keywords].sort(() => Math.random() - 0.5);
  }, [keywords]);
  
  // 最大値を取得（フォントサイズの計算用）
  const maxValue = Math.max(...shuffledKeywords.map(keyword => keyword.value));
  
  return (
    <div className="keyword-cloud flex flex-wrap justify-center gap-3 p-4">
      {shuffledKeywords.map((keyword) => {
        // 相対的なフォントサイズを計算（1.0〜2.5em）
        const fontSize = 1.0 + (keyword.value / maxValue) * 1.5;
        
        // 重要度に応じた色を設定
        const intensity = Math.floor((keyword.value / maxValue) * 900);
        const colorClass = `text-blue-${Math.min(Math.max(intensity, 400), 900)}`;
        
        return (
          <span
            key={keyword.text}
            className={`px-2 py-1 ${colorClass} hover:underline cursor-pointer transition-colors`}
            style={{ fontSize: `${fontSize}em` }}
            title={`${keyword.text}: ${keyword.value}`}
          >
            {keyword.text}
          </span>
        );
      })}
    </div>
  );
}
