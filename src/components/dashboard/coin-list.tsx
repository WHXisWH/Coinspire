'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ipfsToHttps } from '@/lib/ipfs';
import { formatRelativeTime } from '@/utils/format';
import type { CoinDetails } from '@/types/zora';

interface CoinListProps {
  coins: CoinDetails[];
}

export function CoinList({ coins }: CoinListProps) {
  if (!coins || coins.length === 0) {
    return (
      <div className="empty-state text-center p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-2 text-gray-500 dark:text-gray-400">コインデータがありません</p>
      </div>
    );
  }
  
  return (
    <div className="coins-list space-y-4">
      {coins.map((coin) => (
        <Link
          key={coin.id}
          href={`https://zora.co/base/coins/${coin.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="coin-item block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            {/* コイン画像 */}
            <div className="coin-image relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-sm">
              {coin.imageUrl ? (
                <Image
                  src={ipfsToHttps(coin.imageUrl)}
                  alt={coin.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              )}
              
              {/* ホバー時のオーバーレイ */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
            
            {/* コイン情報 */}
            <div className="coin-info flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{coin.name}</h3>
                    {coin.createdAt && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(coin.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">${coin.symbol}</p>
                    {coin.balance && (
                      <span className="ml-3 text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                        保有: {coin.balance.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {parseFloat(coin.marketCap).toLocaleString(undefined, {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    24h: {parseFloat(coin.volume24h).toLocaleString(undefined, {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}