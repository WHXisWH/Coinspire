'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Coinspire</span>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              AIを活用したトレンド分析と創作支援プラットフォーム
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              href="https://zora.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              ZORA
            </Link>
            <Link 
              href="https://base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Base
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              利用規約
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              プライバシー
            </Link>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Coinspire. Powered by ZORA Coins Protocol on Base.
        </div>
      </div>
    </footer>
  );
}
