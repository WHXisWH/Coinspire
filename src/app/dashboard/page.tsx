'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTrends } from '@/hooks/useTrends';
import { useTrendingCoins, useNewCoins } from '@/hooks/useZora';
import { KeywordCloud } from '@/components/dashboard/keyword-cloud';
import { ColorPaletteDisplay } from '@/components/dashboard/color-palette';
import { TrendCard } from '@/components/dashboard/trend-card';
import { CoinList } from '@/components/dashboard/coin-list';
import { TrendChart } from '@/components/dashboard/trend-chart';
import type { Theme, VisualStyle, ColorPalette } from '@/types/trends';

export default function DashboardPage() {
  const { trends, isLoading: trendsLoading } = useTrends();
  const { coins: trendingCoins, isLoading: trendingLoading } = useTrendingCoins(5);
  const { coins: newCoins, isLoading: newCoinsLoading } = useNewCoins(5);
  
  const [activeTab, setActiveTab] = useState<'trends' | 'coins'>('trends');
  const [activeView, setActiveView] = useState<'cloud' | 'chart'>('cloud');
  const [animateIn, setAnimateIn] = useState(false);
  
  // アニメーション効果の管理
  useEffect(() => {
    setAnimateIn(true);
    const timeout = setTimeout(() => setAnimateIn(false), 500);
    return () => clearTimeout(timeout);
  }, [activeTab, activeView]);
  
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">トレンドダッシュボード</h1>
          <p className="text-gray-600 dark:text-gray-400">
            最新のトレンドとコイン情報を確認しましょう
          </p>
        </div>
        
        <Link
          href="/create"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          作成する
        </Link>
      </div>
      
      {/* タブ切り替え */}
      <div className="tabs-header mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === 'trends'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            トレンド分析
          </button>
          <button
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === 'coins'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
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
        <div className={`trends-tab ${animateIn ? 'fade-in' : ''}`}>
          {trendsLoading ? (
            <div className="loading-state flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-card">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <span className="text-gray-600 dark:text-gray-400">トレンドデータをロード中...</span>
            </div>
          ) : (
            <>
              {/* 表示切り替えボタン（キーワードのみ） */}
              <div className="view-toggle flex justify-end mb-4">
                <div className="inline-flex rounded-lg shadow-sm">
                  <button
                    onClick={() => setActiveView('cloud')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                      activeView === 'cloud'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
                  >
                    クラウド表示
                  </button>
                  <button
                    onClick={() => setActiveView('chart')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                      activeView === 'chart'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
                  >
                    チャート表示
                  </button>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* キーワードクラウド/チャート */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <div className="card p-6 h-full">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                      </svg>
                      人気キーワード
                    </h2>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                      {activeView === 'cloud' ? (
                        <KeywordCloud keywords={trends.keywords} />
                      ) : (
                        <TrendChart data={trends.keywords} type="keywords" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 人気テーマ */}
                <div className="trend-card">
                  <div className="card p-6 h-full">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      人気テーマ
                    </h2>
                    {activeView === 'chart' ? (
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                        <TrendChart data={trends.themes} type="themes" height={220} />
                      </div>
                    ) : (
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
                    )}
                  </div>
                </div>
                
                {/* ビジュアルスタイル */}
                <div className="trend-card">
                  <div className="card p-6 h-full">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      人気スタイル
                    </h2>
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
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                      </svg>
                      トレンドカラーパレット
                    </h2>
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
            </>
          )}
        </div>
      )}
      
      {/* 人気コインタブ */}
      {activeTab === 'coins' && (
        <div className={`coins-tab ${animateIn ? 'fade-in' : ''}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* トレンドコイン */}
            <div className="trending-coins">
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  人気上昇中のコイン
                </h2>
                {trendingLoading ? (
                  <div className="loading-state flex justify-center p-6">
                    <div className="w-10 h-10 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <CoinList coins={trendingCoins} />
                )}
              </div>
            </div>
            
            {/* 新着コイン */}
            <div className="new-coins">
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  新着コイン
                </h2>
                {newCoinsLoading ? (
                  <div className="loading-state flex justify-center p-6">
                    <div className="w-10 h-10 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
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