'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@/components/wallet/connect-button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Coinspire</span>
          </Link>
          
          {/* デスクトップメニュー */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              ダッシュボード
            </Link>
            <Link 
              href="/create" 
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              作成する
            </Link>
          </nav>
          
          {/* ウォレット接続ボタン (デスクトップ) */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>
          
          {/* モバイルメニューボタン */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>
        
        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                ダッシュボード
              </Link>
              <Link 
                href="/create" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                作成する
              </Link>
              <div className="pt-2">
                <ConnectButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
