'use client';

interface TrendCardProps {
  name: string;
  value: number;  // 0-1の値
  rank: number;
}

export function TrendCard({ name, value, rank }: TrendCardProps) {
  // 値を%に変換（表示用）
  const percentage = Math.round(value * 100);
  
  return (
    <div className="trend-item flex items-center space-x-4">
      <div className="rank-badge flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
        {rank}
      </div>
      
      <div className="trend-info flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{name}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{percentage}%</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
