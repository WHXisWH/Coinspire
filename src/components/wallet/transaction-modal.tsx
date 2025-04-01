'use client';

import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { extractCoinAddressFromReceipt } from '@/lib/zora';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: `0x${string}` | null;
  onSuccess?: (address?: string) => void;
}

export function TransactionModal({ 
  isOpen, 
  onClose, 
  txHash, 
  onSuccess 
}: TransactionModalProps) {
  const [step, setStep] = useState<'processing' | 'success' | 'error'>('processing');
  
  // Wait for transaction receipt
  const { 
    data: receipt, 
    isLoading, 
    isError, 
    error 
  } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: !!txHash && isOpen,
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
            </>
          )}
          
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {step === 'success' ? '完了' : '閉じる'}
            </button>
            
            {step === 'error' && txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
              >
                詳細を確認
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
