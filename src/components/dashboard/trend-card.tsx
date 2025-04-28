'use client';

import { useState, memo } from 'react';

interface TrendCardProps {
  name: string;
  value: number;  // 0-1の値
  rank: number;
}

export const TrendCard = memo(function TrendCard({ name, value, rank }: TrendCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // 値を%に変換（表示用）
  const percentage: number = Math.round(value * 100);
  
  // ランクに応じた色を設定
  const getBadgeColor = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 2: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
      case 3: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };
  
  // 値に応じたグラデーションカラーを設定
  const getGradientClass = (percentage: number) => {
    if (percentage >= 80) return 'from-primary-500 to-primary-600';
    if (percentage >= 60) return 'from-primary-400 to-primary-500';
    if (percentage >= 40) return 'from-primary-300 to-primary-400';
    if (percentage >= 20) return 'from-primary-200 to-primary-300';
    return 'from-primary-100 to-primary-200';
  };
  
  return (
    <div 
      className={`trend-item p-3 rounded-lg transition-all duration-200 ${
        isHovered ? 'bg-gray-50 dark:bg-gray-800/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        <div className={`rank-badge flex items-center justify-center w-8 h-8 rounded-full ${getBadgeColor(rank)} font-semibold transition-transform ${isHovered ? 'scale-110' : ''}`}>
          {rank}
        </div>
        
        <div className="trend-info flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-medium">{name}</span>
            <span className={`text-sm ${
              percentage >= 70 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {percentage}%
            </span>
          </div>
          
          <div className="relative w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${getGradientClass(percentage)} transition-all duration-500 ${isHovered ? 'opacity-80' : 'opacity-100'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
});