import { useState, useEffect } from 'react';
import {
  usePublicClient,
  useWalletClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';
import type { Address, Hash } from 'viem';
import { createContentCoin } from '@/lib/zora'; // MintResultはlibで定義する方針に
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
    /* 前提チェック */
    if (!walletClient || !walletClient.account || !publicClient) {
      setError('ウォレットが接続されていません。');
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

    try {
      const gasOverrides = await getOptimizedGasParams(publicClient);

      const mintResult = await createContentCoin(
        walletClient,
        publicClient,
        { content, title, symbol, description, creatorAddress },
        gasOverrides, // ← viem Tx parameters と互換のオブジェクト
      );

      if (!mintResult.success) {
        setError(mintResult.error ?? 'mint に失敗しました');
        return null;
      }

      setResult(mintResult);
      return mintResult;
    } catch (err: unknown) {
      console.error(err);
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

  /* --- ① createCoinCall → SimulateContractParameters を作成 --- */
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

        const gasOverrides = await getOptimizedGasParams(publicClient);
        const config = {
          address: call.address,
          abi: call.abi,
          functionName: call.functionName,
          args: call.args,
          ...gasOverrides, // ← maxFeePerGas / maxPriorityFeePerGas 等
          value: coinParams.initialPurchaseWei,
        };

        if (mounted) {
          setSimulateConfig(config);
          setError(null);
        }
      } catch (err) {
        console.error(err);
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
  }, [coinParams, publicClient]);

  /* --- ② wagmi hooks --- */
  const {
    data: simulateData,
    error: simulateError,
    isError: isSimErr,
  } = useSimulateContract(simulateConfig ?? undefined);

  // wagmi v2の形式に修正
  const { writeContract, status, data: txData, error: writeError } =
    useWriteContract();

  /* --- ③ エラーマージ --- */
  useEffect(() => {
    if (simulateError) setError(simulateError);
    if (writeError) setError(writeError);
  }, [simulateError, writeError]);

  /* --- ④ 外部公開関数 --- */
  const prepareCoin = (params: CreateCoinParams) => setCoinParams(params);

  const createCoin = async () => {
    if (!simulateData?.request) {
      setError(
        simulateError ??
          new Error('シミュレーションが未完了のためトランザクションを送信できません'),
      );
      return;
    }

    try {
      const gasOverrides = await getOptimizedGasParams(publicClient);
      writeContract({ ...simulateData.request, ...gasOverrides });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err
          : new Error('トランザクション送信中にエラーが発生しました'),
      );
    }
  };

  return {
    prepareCoin,
    createCoin,
    /* 状態 */
    isLoading:
      status === 'pending' ||
      (!!coinParams && !simulateData && !isSimErr && !writeError),
    isSimulating: !!coinParams && !simulateData && !isSimErr,
    isConfirming: status === 'pending',
    isSuccess: status === 'success',
    transactionData: txData as Hash | undefined,
    error,
  };
}

/* ─────────────── Trending / New Coins SWR ─────────────── */

const makeFetcher = (fallbackMsg: string) => async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(fallbackMsg);
    const data = await res.json();
    return data.coins ?? [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export function useTrendingCoins(count = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/trending?count=${count}`,
    makeFetcher('トレンドコイン取得失敗'),
    { refreshInterval: 60_000, fallbackData: [], revalidateOnFocus: false },
  );

  return { coins: data!, isLoading, error, refresh: mutate };
}

export function useNewCoins(count = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/new?count=${count}`,
    makeFetcher('新着コイン取得失敗'),
    { refreshInterval: 60_000, fallbackData: [], revalidateOnFocus: false },
  );

  return { coins: data!, isLoading, error, refresh: mutate };
}
