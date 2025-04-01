'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ipfsToHttps } from '@/lib/ipfs';
import type { CoinDetails } from '@/types/zora';

interface CoinListProps {
  coins: CoinDetails[];
}

export function CoinList({ coins }: CoinListProps) {
  if (!coins || coins.length === 0) {
    return (
      <div className="empty-state text-center p-6 text-gray-500 dark:text-gray-400">
        コインデータがありません
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
          className="coin-item block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            {/* コイン画像 */}
            <div className="coin-image relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
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
            </div>
            
            {/* コイン情報 */}
            <div className="coin-info flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{coin.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">${coin.symbol}</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
