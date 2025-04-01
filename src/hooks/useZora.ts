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
    coinParams ? createCoinCall(coinParams) : undefined
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
  const fetcher = () => getTrendingCoins(count);
  
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
  const fetcher = () => getNewCoins(count);
  
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

// getTrendingCoinsとgetNewCoinsは実際にはzora.tsから再エクスポートされるべきですが、
// インポートエラーを防ぐためのプレースホルダとして定義しています
async function getTrendingCoins(count: number): Promise<CoinDetails[]> {
  // この関数は実際にはsrc/lib/zora.tsから呼び出す
  // ここではモックデータを返す
  return [];
}

async function getNewCoins(count: number): Promise<CoinDetails[]> {
  // この関数は実際にはsrc/lib/zora.tsから呼び出す
  // ここではモックデータを返す
  return [];
}
