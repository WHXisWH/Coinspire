import { useState } from 'react';
import { usePublicClient, useWalletClient, useWriteContract, useSimulateContract } from 'wagmi';
import { createContentCoin, extractCoinAddressFromReceipt } from '@/lib/zora';
import { createCoinCall } from "@zoralabs/coins-sdk";
import type { CoinDetails, CreateCoinParams } from '@/types/zora';
import useSWR from 'swr';
import { Address } from 'viem';

export function useZoraMint() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    hash?: string;
    address?: Address;
  } | null>(null);

  const mint = async (
    content: File,
    title: string,
    symbol: string,
    description: string,
    creatorAddress: Address
  ) => {
    if (!walletClient || !publicClient) {
      setError('ウォレットが接続されていません');
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

      setResult(mintResult);
      return mintResult;
    } catch (err: any) {
      const errorMessage = err.message || 'コインの作成中にエラーが発生しました';
      setError(errorMessage);
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

export function useZoraCreateCoin() {
  const [coinParams, setCoinParams] = useState<CreateCoinParams | null>(null);
  
  const { data: writeConfig } = useSimulateContract(
    coinParams ? {
      ...createCoinCall(coinParams),
      // weiの値がある場合、valueに設定
      value: coinParams.initialPurchaseWei
    } : undefined
  );
  
  const { writeContract, status, data: txData } = useWriteContract(writeConfig);
  
  const prepareCoin = (params: CreateCoinParams) => {
    setCoinParams(params);
  };
  
  const createCoin = () => {
    if (writeContract) {
      writeContract();
    }
  };
  
  return {
    prepareCoin,
    createCoin,
    isLoading: status === 'pending',
    transactionData: txData
  };
}

export function useTrendingCoins(count = 10) {
  const fetcher = async () => {
    try {
      // 実際のAPIエンドポイントを呼び出す
      const response = await fetch(`/api/coins/trending?count=${count}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trending coins');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return [];
    }
  };
  
  const { data, error, isLoading, mutate } = useSWR(
    'trending-coins',
    fetcher,
    { refreshInterval: 60000 } // 1分ごとに更新
  );
  
  return {
    coins: data || [],
    isLoading,
    error,
    refresh: mutate
  };
}

export function useNewCoins(count = 10) {
  const fetcher = async () => {
    try {
      // 実際のAPIエンドポイントを呼び出す
      const response = await fetch(`/api/coins/new?count=${count}`);
      if (!response.ok) {
        throw new Error('Failed to fetch new coins');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching new coins:', error);
      return [];
    }
  };
  
  const { data, error, isLoading, mutate } = useSWR(
    'new-coins',
    fetcher,
    { refreshInterval: 60000 } // 1分ごとに更新
  );
  
  return {
    coins: data || [],
    isLoading,
    error,
    refresh: mutate
  };
}
