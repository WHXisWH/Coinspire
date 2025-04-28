import { useState, useEffect } from 'react';
import {
  usePublicClient,
  useWalletClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';
import type { Abi, Address, Hash, PublicClient, Chain, Account } from 'viem';
import { createContentCoin } from '@/lib/zora';
import { createCoinCall } from '@zoralabs/coins-sdk';
import type { CreateCoinParams } from '@/types/zora';
import useSWR from 'swr';
import { getOptimizedGasParams } from '@/utils/gas';

interface MintResult {
  success: boolean;
  hash?: string;
  address?: Address;
  error?: string;
}

/* ─────────────── useZoraMint ─────────────── */
export function useZoraMint() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MintResult | null>(null);

  const mint = async (
    content: File,
    title: string,
    symbol: string,
    description: string,
    creatorAddress: Address,
  ) => {
    if (!walletClient || !walletClient.account) {
       setError('ウォレットが接続されていません。');
       return null;
    }
    if (!publicClient) {
        setError('ネットワーク接続を確認してください (Public Client not available)。');
        return null;
    }
    if (!content) {
      setError('コンテンツファイルが選択されていません');
      return null;
    }
    if (!title || !symbol || !description) {
      setError('タイトル／シンボル／説明を入力してください。');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const mintResult = await createContentCoin(
        walletClient,
        publicClient,
        { content, title, symbol, description, creatorAddress }
      );

      if (!mintResult.success) {
        setError(mintResult.error ?? 'mint に失敗しました');
        return null;
      }

      setResult(mintResult);
      return mintResult;
    } catch (err: unknown) {
      console.error('Error during mint process:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'コインの作成中に不明なエラーが発生しました',
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mint, isLoading, error, result };
}


/* ─────────────── useZoraCreateCoin ─────────────── */
export function useZoraCreateCoin() {
  const publicClient = usePublicClient();

  const [coinParams, setCoinParams] = useState<CreateCoinParams | null>(null);
  const [simulateConfig, setSimulateConfig] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!coinParams) {
      setSimulateConfig(null);
      return;
    }
    let mounted = true;

    (async () => {
      try {
        const call = await createCoinCall(coinParams);
        if (!call) throw new Error('createCoinCall が失敗しました');

        const config = {
          address: call.address,
          abi: call.abi,
          functionName: call.functionName,
          args: call.args,
          value: coinParams.initialPurchaseWei,
        };

        if (mounted) {
          setSimulateConfig(config);
          setError(null);
        }
      } catch (err) {
        console.error('Error preparing simulation:', err);
        if (mounted) {
          setSimulateConfig(null);
          setError(
            err instanceof Error
              ? err
              : new Error('コイン作成シミュレーション準備に失敗しました'),
          );
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [coinParams]);

  const {
    data: simulateData,
    error: simulateError,
    isError: isSimErr,
  } = useSimulateContract(simulateConfig ?? undefined);

  const {
    writeContract,
    status,
    data: txData,
    error: writeError,
  } = useWriteContract();

  useEffect(() => {
    if (simulateError) setError(simulateError);
    if (writeError) setError(writeError);
  }, [simulateError, writeError]);

  const prepareCoin = (params: CreateCoinParams) => {
    setError(null);
    setCoinParams(params);
  }

  const createCoin = async () => {
    if (!publicClient) {
      setError(new Error('ネットワーク接続を確認してください (Public Client not available)。'));
      return;
    }

    if (!simulateData?.request) {
      setError(
        simulateError ??
        new Error('シミュレーションが未完了か失敗したためトランザクションを送信できません')
      );
      return;
    }

    if (status === 'pending') {
      console.log("Transaction is already pending.");
      return;
    }

    setError(null);

    try {
      const gasOverrides = await getOptimizedGasParams(publicClient);

      const writeArgs = {
        address: simulateData.request.address,
        abi: simulateData.request.abi,
        functionName: simulateData.request.functionName,
        args: simulateData.request.args,
        ...(simulateData.request.value !== undefined && { value: simulateData.request.value }), // valueを条件付きで含める
        type: 'eip1559' as const, // type を固定
        maxFeePerGas: gasOverrides.maxFeePerGas ?? simulateData.request.maxFeePerGas, // トップレベルに配置
        maxPriorityFeePerGas: gasOverrides.maxPriorityFeePerGas ?? simulateData.request.maxPriorityFeePerGas, // トップレベルに配置
      } satisfies Parameters<typeof writeContract>[0];

      console.log("Attempting to send transaction with args:", writeArgs);

      await writeContract(writeArgs);
      console.log("Transaction sent, waiting for confirmation...");

    } catch (err) {
      console.error('Error sending transaction:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('トランザクション送信中に不明なエラーが発生しました'),
      );
    }
  };

  const isLoadingSimulate = !!coinParams && !simulateData && !isSimErr && !simulateError;
  const isConfirming = status === 'pending';
  const isSuccess = status === 'success';

  return {
    prepareCoin,
    createCoin,
    isLoading: isLoadingSimulate || isConfirming,
    isSimulating: isLoadingSimulate,
    isConfirming: isConfirming,
    isSuccess: isSuccess,
    transactionData: txData as Hash | undefined,
    error,
  };
}

/* ─────────────── Trending / New Coins SWR ─────────────── */
const makeFetcher = (fallbackMsg: string) => async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`, errorText);
      throw new Error(`${fallbackMsg} (status: ${res.status})`);
    }
    const data = await res.json();
    return data?.coins ?? [];
  } catch (err) {
    console.error(`Error in fetcher for ${url}:`, err);
    return [];
  }
};

const swrOptions = {
  refreshInterval: 60_000,
  fallbackData: [],
  revalidateOnFocus: false,
};

export function useTrendingCoins(count = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/trending?count=${count}`,
    makeFetcher('トレンドコイン取得失敗'),
    swrOptions
  );
  return { coins: data, isLoading, error, refresh: mutate };
}

export function useNewCoins(count = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/new?count=${count}`,
    makeFetcher('新着コイン取得失敗'),
    swrOptions
  );
  return { coins: data, isLoading, error, refresh: mutate };
}
