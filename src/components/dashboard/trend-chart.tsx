import React, { useMemo, useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
  const colors = {
    bar: [
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
    ],
    active: [
      '#2563eb', // blue-600
      '#4338ca', // indigo-700
      '#4f46e5', // indigo-600
      '#7c3aed', // violet-600
      '#9333ea', // purple-600
      '#c026d3', // fuchsia-600
      '#db2777', // pink-600
      '#e11d48', // rose-600
      '#dc2626', // red-600
      '#ea580c', // orange-600
    ]
  };

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-800 dark:text-white">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {type === 'keywords' ? '出現回数' : '人気度'}: 
            <span className="font-medium text-primary-600 dark:text-primary-400 ml-1">
              {payload[0].value}{type === 'themes' ? '%' : ''}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">データがありません</p>
        </div>
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
          onMouseMove={(data) => {
            if (data.activeTooltipIndex !== undefined) {
              setActiveIndex(data.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            {/* グラデーション定義 */}
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          {showXAxis && (
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
          )}
          {showYAxis && (
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              tickFormatter={(value) => `${value}${type === 'themes' ? '%' : ''}`}
            />
          )}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(224, 231, 255, 0.2)' }}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-in-out"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={activeIndex === index ? colors.active[index % colors.active.length] : colors.bar[index % colors.bar.length]}
                className="transition-colors duration-300"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}