import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Keyword, Theme } from '@/types/trends';

interface TrendChartProps {
  data: Keyword[] | Theme[];
  type: 'keywords' | 'themes';
  height?: number;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export function TrendChart({ 
  data, 
  type, 
  height = 300,
  showXAxis = true,
  showYAxis = true
}: TrendChartProps) {

  const chartData = useMemo(() => {
    if (type === 'keywords') {
      // Keywordタイプの場合
      return (data as Keyword[]).map(item => ({
        name: item.text,
        value: item.value
      })).sort((a, b) => b.value - a.value).slice(0, 10);
    } else {
      // Themeタイプの場合
      return (data as Theme[]).map(item => ({
        name: item.name,
        value: Math.round(item.popularity * 100)
      })).sort((a, b) => b.value - a.value).slice(0, 10);
    }
  }, [data, type]);

  // グラデーションカラー
  const colors = [
    '#3b82f6', // blue-500
    '#4f46e5', // indigo-600
    '#6366f1', // indigo-500
    '#8b5cf6', // violet-500
    '#a855f7', // purple-500
    '#d946ef', // fuchsia-500
    '#ec4899', // pink-500
    '#f43f5e', // rose-500
    '#ef4444', // red-500
    '#f97316', // orange-500
  ];

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">データがありません</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: showYAxis ? 20 : 0,
            bottom: 5,
          }}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          {showXAxis && (
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
          )}
          {showYAxis && (
            <YAxis tick={{ fontSize: 12 }} />
          )}
          <Tooltip
            contentStyle={{ 
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [
              `${value}${type === 'themes' ? '%' : ''}`, 
              type === 'keywords' ? '出現回数' : '人気度'
            ]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}