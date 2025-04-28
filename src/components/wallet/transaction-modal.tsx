'use client';

import { useState, useEffect, useCallback } from 'react';
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
  onRetry,
}: TransactionModalProps) {
  /** 表示ステップを管理：processing / success / error */
  const [step, setStep] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );

  /** 「再試行」ボタン押下時のハンドラ */
  const handleRetry = useCallback(() => {
    setStep('processing');
    onRetry?.();
    onClose();
  }, [onRetry, onClose]);

  /** txHash が null の場合は undefined にしてフックに渡す */
  const transactionHash = txHash as `0x${string}` | undefined;

  /**
   * wagmi-v2 の `useWaitForTransactionReceipt`
   * - enabled を false にすると EVM ポーリングを停止できる
   * - receipt.status は 'success' | 'reverted'
   */
  const {
    data: receipt,
    isLoading,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    hash: transactionHash,
    confirmations: 1,
    enabled: isOpen && !!transactionHash,
  });

  /** receipt または isError の変化に応じてステップを更新 */
  useEffect(() => {
    if (receipt) {
      if (receipt.status === 'success') {
        setStep('success');
        const coinAddress = extractCoinAddressFromReceipt(receipt);
        if (coinAddress) onSuccess?.(coinAddress);
      } else {
        setStep('error');
      }
    } else if (isError) {
      setStep('error');
    }
  }, [receipt, isError, onSuccess]);

  /** モーダル自体を閉じている場合は描画しない */
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="text-center">
          {/* 処理中ステップ */}
          {isLoading && step === 'processing' && (
            <>
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <h3 className="mb-2 text-xl font-semibold">
                トランザクション処理中
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                ブロックチェーンで処理されるまでお待ちください…
              </p>
            </>
          )}

          {/* 成功ステップ */}
          {step === 'success' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg
                  className="h-10 w-10 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">成功しました！</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                トランザクションが正常に完了しました。
              </p>
            </>
          )}

          {/* エラーステップ */}
          {step === 'error' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 p-3 dark:bg-red-900">
                <svg
                  className="h-10 w-10 text-red-600 dark:text-red-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                エラーが発生しました
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {error?.message ||
                  'トランザクションの処理中にエラーが発生しました。'}
              </p>
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm dark:bg-red-900/30">
                <p className="mb-1 font-medium">考えられる原因:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>ネットワーク接続の問題</li>
                  <li>ウォレットの残高不足</li>
                  <li>ガス価格の急激な変動</li>
                  <li>トランザクションパラメータの問題</li>
                </ul>
              </div>
            </>
          )}

          {/* ボタンセクション */}
          <div className="mt-6 flex justify-center">
            {step === 'success' ? (
              <button
                onClick={onClose}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                完了
              </button>
            ) : step === 'error' ? (
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  閉じる
                </button>

                {txHash && (
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
                  >
                    詳細を確認
                  </a>
                )}

                <button
                  onClick={handleRetry}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  再試行
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
