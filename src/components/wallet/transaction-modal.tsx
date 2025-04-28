'use client';

import { useState, useEffect, Fragment, useCallback } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { extractCoinAddressFromReceipt } from '@/lib/zora';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: `0x${string}` | null;
  onSuccess?: (address?: string) => void;
  onRetry?: () => void;
}

export function TransactionModal({ 
  isOpen, 
  onClose, 
  txHash, 
  onSuccess,
  onRetry 
}: TransactionModalProps) {
  const [step, setStep] = useState<'processing' | 'success' | 'error'>('processing');
  
  const handleRetry = useCallback(() => {
    setStep('processing');
    if (onRetry) {
      onRetry();
    }
    onClose();
  }, [onRetry, onClose]);
  
  const transactionHash = txHash ? txHash as `0x${string}` : undefined;
  
  // Always call the hook, but use 'enabled' to conditionally enable it
  const { 
    data: receipt, 
    isLoading, 
    isError, 
    error 
  } = useWaitForTransactionReceipt({
    hash: transactionHash,
    enabled: isOpen && !!transactionHash,
  });
  
  useEffect(() => {
    if (receipt) {
      if (receipt.status === 'success') {
        setStep('success');
        const coinAddress = extractCoinAddressFromReceipt(receipt);
        if (onSuccess && coinAddress) onSuccess(coinAddress);
      } else {
        setStep('error');
      }
    } else if (isError) {
      setStep('error');
    }
  }, [receipt, isError, onSuccess]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="text-center">
          {step === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">トランザクション処理中</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                トランザクションがブロックチェーンで処理されるまでお待ちください...
              </p>
            </>
          )}
          
          {step === 'success' && (
            <>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">成功しました！</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                トランザクションが正常に完了しました。
              </p>
            </>
          )}
          
          {step === 'error' && (
            <>
              <div className="bg-red-100 dark:bg-red-900 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">エラーが発生しました</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error?.message || 'トランザクションの処理中にエラーが発生しました。'}
              </p>
              <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg mb-4 text-sm">
                <p className="font-medium mb-1">考えられる原因:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>ネットワーク接続の問題</li>
                  <li>ウォレットの残高不足</li>
                  <li>ガス価格の急激な変動</li>
                  <li>トランザクションパラメータの問題</li>
                </ul>
              </div>
            </>
          )}

          {/* ボタンセクション */}
          <div className="flex justify-center mt-6">
            {step === 'success' ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                完了
              </button>
            ) : step === 'error' ? (
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  閉じる
                </button>
                
                {txHash && (
                  
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                  >
                    詳細を確認
                  </a>
                )}
                
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  再試行
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                閉じる
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}