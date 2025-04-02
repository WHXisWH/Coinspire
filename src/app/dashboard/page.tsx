'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTrends } from '@/hooks/useTrends';
import { useTrendingCoins, useNewCoins } from '@/hooks/useZora';
import { KeywordCloud } from '@/components/dashboard/keyword-cloud';
import { ColorPaletteDisplay } from '@/components/dashboard/color-palette';
import { TrendCard } from '@/components/dashboard/trend-card';
import { CoinList } from '@/components/dashboard/coin-list';
// type だけをインポートして Next.js ページからエクスポートされないようにする
import type { Theme, VisualStyle, ColorPalette } from '@/types/trends';

export default function DashboardPage() {
  const { trends, isLoading: trendsLoading } = useTrends();
  const { coins: trendingCoins, isLoading: trendingLoading } = useTrendingCoins(5);
  const { coins: newCoins, isLoading: newCoinsLoading } = useNewCoins(5);
  
  const [activeTab, setActiveTab] = useState<'trends' | 'coins'>('trends');
  
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">トレンドダッシュボード</h1>
        
        <Link
          href="/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          作成する
        </Link>
      </div>
      
      {/* タブ切り替え */}
      <div className="tabs-header mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'trends'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            トレンド分析
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'coins'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('coins')}
          >
            人気コイン
          </button>
        </div>
      </div>
      
      {/* トレンド分析タブ */}
      {activeTab === 'trends' && (
        <div className="trends-tab">
          {trendsLoading ? (
            <div className="loading-state flex justify-center items-center p-12">
              <span className="loading">トレンドデータをロード中...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* キーワードクラウド */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">人気キーワード</h2>
                  <KeywordCloud keywords={trends.keywords} />
                </div>
              </div>
              
              {/* 人気テーマ */}
              <div className="trend-card">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
                  <h2 className="text-xl font-semibold mb-4">人気テーマ</h2>
                  <div className="space-y-4">
                    {trends.themes.slice(0, 5).map((theme: Theme, index: number) => (
                      <TrendCard 
                        key={theme.name}
                        name={theme.name}
                        value={theme.popularity}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* ビジュアルスタイル */}
              <div className="trend-card">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
                  <h2 className="text-xl font-semibold mb-4">人気スタイル</h2>
                  <div className="space-y-4">
                    {trends.visualStyles.slice(0, 5).map((style: VisualStyle, index: number) => (
                      <TrendCard 
                        key={style.name}
                        name={style.name}
                        value={index === 0 ? 1 : 1 - (index * 0.15)}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* カラーパレット */}
              <div className="col-span-1 md:col-span-3">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">トレンドカラーパレット</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trends.colorPalettes.slice(0, 3).map((palette: ColorPalette) => (
                      <ColorPaletteDisplay
                        key={palette.name}
                        name={palette.name}
                        colors={palette.colors}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 人気コインタブ */}
      {activeTab === 'coins' && (
        <div className="coins-tab">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* トレンドコイン */}
            <div className="trending-coins">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">人気上昇中のコイン</h2>
                {trendingLoading ? (
                  <div className="loading-state flex justify-center p-6">
                    <span className="loading">ロード中...</span>
                  </div>
                ) : (
                  <CoinList coins={trendingCoins} />
                )}
              </div>
            </div>
            
            {/* 新着コイン */}
            <div className="new-coins">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">新着コイン</h2>
                {newCoinsLoading ? (
                  <div className="loading-state flex justify-center p-6">
                    <span className="loading">ロード中...</span>
                  </div>
                ) : (
                  <CoinList coins={newCoins} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
