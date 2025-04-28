'use client';

import { useState, useEffect } from 'react';
import { 
  usePublicClient, 
  useWalletClient, 
  useSimulateContract, 
  useWriteContract 
} from 'wagmi';
import { createContentCoin } from '@/lib/zora';
import { createCoinCall } from '@zoralabs/coins-sdk';
import type { Address } from 'viem';
import type { CreateCoinParams } from '@/types/zora';
import useSWR from 'swr';
import { getOptimizedGasParams } from '@/utils/gas';

/* ─────────────── useZoraMint ─────────────── */

export function useZoraMint() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    hash?: string;
    address?: Address;
    error?: string;
  } | null>(null);

  const mint = async (
    content: File,
    title: string,
    symbol: string,
    description: string,
    creatorAddress: Address
  ) => {
    if (!walletClient || !walletClient.account || !publicClient) {
      setError('ウォレットが接続されていません。');
      return null;
    }
    if (!content) {
      setError('コンテンツファイルが選択されていません。');
      return null;
    }
    if (!title || !symbol || !description) {
      setError('タイトル、シンボル、説明を入力してください。');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const mintResult = await createContentCoin(
        walletClient,
        publicClient,
        {
          content,
          title,
          symbol,
          description,
          creatorAddress
        }
      );

      if (!mintResult.success) {
        setError(mintResult.error ?? 'コイン作成に失敗しました。');
        return null;
      }

      setResult(mintResult);
      return mintResult;
    } catch (err: any) {
      console.error('Error in mint function:', err);
      setError(err.message ?? 'コイン作成中にエラーが発生しました。');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mint,
    isLoading,
    error,
    result
  };
}

/* ─────────────── useZoraCreateCoin ─────────────── */

export function useZoraCreateCoin() {
  const publicClient = usePublicClient();
  const [coinParams, setCoinParams] = useState<CreateCoinParams | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const {
    data: simulateData,
    error: simulateError,
    isPending: isSimPending,
  } = useSimulateContract(
    coinParams
      ? {
          ...coinParams,
        }
      : undefined,
    {
      query: { enabled: !!coinParams },
    }
  );

  const { writeContract, status, data: txData, error: writeError } = useWriteContract();

  useEffect(() => {
    if (simulateError) setError(simulateError);
    if (writeError) setError(writeError);
  }, [simulateError, writeError]);

  const prepareCoin = (params: CreateCoinParams) => {
    setCoinParams(params);
  };

  const createCoin = async () => {
    if (!simulateData?.request) {
      setError(new Error('シミュレーションデータが取得できませんでした'));
      return;
    }

    try {
      const gasOverrides = await getOptimizedGasParams(publicClient);
      await writeContract({
        ...simulateData.request,
        ...gasOverrides
      });
    } catch (err: any) {
      console.error('Error sending transaction:', err);
      setError(err);
    }
  };

  return {
    prepareCoin,
    createCoin,
    isLoading: status === 'pending' || isSimPending,
    isSimulating: isSimPending,
    isConfirming: status === 'pending',
    isSuccess: status === 'success',
    transactionData: txData,
    error,
  };
}

/* ─────────────── useTrendingCoins / useNewCoins ─────────────── */

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTrendingCoins(count = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/trending?count=${count}`,
    fetcher,
    {
      refreshInterval: 60000,
      fallbackData: [],
      revalidateOnFocus: false,
    }
  );

  return {
    coins: data?.coins ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useNewCoins(count = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/new?count=${count}`,
    fetcher,
    {
      refreshInterval: 60000,
      fallbackData: [],
      revalidateOnFocus: false,
    }
  );

  return {
    coins: data?.coins ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}
