'use client';

import { ConnectKitButton } from 'connectkit';
import { useState } from 'react';

export function ConnectButton() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address, ensName, chain }) => {
        return (
          <button
            onClick={show}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative inline-flex items-center overflow-hidden transition-all duration-300 ${
              isConnected
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 px-4 py-2 rounded-lg'
                : 'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg'
            }`}
          >
            {/* パルス効果（接続中のみ） */}
            {isConnecting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-lg bg-primary-400 opacity-75"></span>
              </span>
            )}
            
            {/* ボタン内容 */}
            <div className="relative flex items-center">
              {isConnecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  接続中...
                </>
              ) : isConnected ? (
                <>
                  <div className="relative mr-2">
                    <div className={`w-2 h-2 bg-green-500 rounded-full absolute -left-1 top-1/2 transform -translate-y-1/2 ${isHovered ? 'animate-pulse' : ''}`}></div>
                    <div className="w-6 h-6 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full">
                      <svg className="w-3 h-3 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {ensName || `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`}
                    </span>
                    {chain && isHovered && (
                      <span className="text-xs opacity-80">{chain.name}</span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span className="font-medium">ウォレットを接続</span>
                </>
              )}
              
              {isConnected && isHovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-90 dark:bg-opacity-90 transition-opacity duration-300 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-sm text-green-700 dark:text-green-300">設定</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* ホバー時のアニメーション効果 */}
            {!isConnected && isHovered && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 animate-pulse opacity-30"></span>
            )}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}