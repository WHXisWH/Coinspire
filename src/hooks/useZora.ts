import { useState, useEffect } from 'react';
import {
  usePublicClient,
  useWalletClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';
// PublicClient 型を viem からインポート
import type { Address, Hash, PublicClient } from 'viem';
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
  const publicClient = usePublicClient(); // publicClient を取得

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
    // walletClient と publicClient の存在チェック
    if (!walletClient || !walletClient.account) {
       setError('ウォレットが接続されていません。');
       return null;
    }
    if (!publicClient) {
        // publicClient が必須な場合に備えてチェック
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
    setResult(null); // 開始時に結果をクリア

    try {
      const mintResult = await createContentCoin(
        walletClient,
        publicClient, // publicClient が不要なら渡さなくても良い場合がある
        {
          content,
          title,
          symbol,
          description,
          creatorAddress,
          // gasOverrides, // 削除
        }
      );

      if (!mintResult.success) {
        setError(mintResult.error ?? 'mint に失敗しました');
        // setResult(null); // 上でクリア済み
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
      // setResult(null); // 上でクリア済み
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mint, isLoading, error, result };
}

/* ─────────────── useZoraCreateCoin ─────────────── */

export function useZoraCreateCoin() {
  const publicClient = usePublicClient(); // publicClient を取得

  const [coinParams, setCoinParams] = useState<CreateCoinParams | null>(null);
  // simulateConfig の型は createCoinCall の戻り値や useSimulateContract の引数型に合わせるのが理想
  const [simulateConfig, setSimulateConfig] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // coinParams が変更されたらシミュレーション設定を準備
  useEffect(() => {
    if (!coinParams) {
      setSimulateConfig(null);
      return;
    }
    let mounted = true;

    (async () => {
      try {
        // publicClient が createCoinCall に必要ならここでチェック
        // if (!publicClient) throw new Error('Public client not available');

        const call = await createCoinCall(coinParams);
        if (!call) throw new Error('createCoinCall が失敗しました');

        // useSimulateContract 用の設定オブジェクト
        const config = {
          address: call.address,
          abi: call.abi,
          functionName: call.functionName,
          args: call.args,
          value: coinParams.initialPurchaseWei,
          // account: walletClient?.account?.address, // 必要に応じてアカウント情報を追加
        };

        if (mounted) {
          setSimulateConfig(config);
          setError(null); // 準備成功時にエラーをクリア
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
    // publicClient が準備に必要な場合は依存配列に追加
  }, [coinParams]);

  // シミュレーションの実行
  const {
    data: simulateData,
    error: simulateError,
    isError: isSimErr,
    // status を使ってローディング状態を管理することも可能
    // isLoading: isSimulatingFetch,
  } = useSimulateContract(simulateConfig ?? undefined);

  // コントラクト書き込み (トランザクション送信)
  const {
    writeContract,
    status, // 'idle' | 'pending' | 'success' | 'error'
    data: txData,
    error: writeError,
  } = useWriteContract();

  // シミュレーションエラーと書き込みエラーを一元管理
  useEffect(() => {
    if (simulateError) {
        console.error("Simulation Error:", simulateError);
        // エラーメッセージがユーザーフレンドリーでない場合、ここで加工も可能
        setError(simulateError);
    } else if (writeError) {
        console.error("Write Contract Error:", writeError);
        setError(writeError);
    }
    // 成功時やアイドル時にエラーをクリアするかどうかは設計次第
    // else if (status === 'success' || status === 'idle') {
    //   setError(null);
    // }
  }, [simulateError, writeError, status]);

  // コイン作成パラメータを設定する関数
  const prepareCoin = (params: CreateCoinParams) => {
      setError(null); // 新しい準備を開始する際にエラーをクリア
      setCoinParams(params);
  }

  // コイン作成 (トランザクション送信) を実行する関数
  const createCoin = async () => {
    // --- ★ 修正点 2: publicClient の存在チェック ---
    // getOptimizedGasParams で必要なので、先にチェック
    if (!publicClient) {
      setError(new Error('ネットワーク接続を確認してください (Public Client not available)。'));
      console.error('Public client is not available for gas optimization.');
      return;
    }

    // シミュレーション結果(request)の存在チェック
    if (!simulateData?.request) {
      console.error('Simulation request data is not available.', { simulateError, isSimErr });
      setError(
        simulateError ?? // シミュレーション自体がエラーだった場合
        new Error('シミュレーションが未完了か失敗したためトランザクションを送信できません')
      );
      return;
    }

    // 既に処理中の場合は重複実行を防ぐ
    if (status === 'pending') {
        console.log("Transaction is already pending.");
        return;
    }

    setError(null); // 送信開始前にエラーをクリア

    try {
      // --- ★ 修正点 3: ガス代最適化パラメータの取得とマージ ---
      console.log("Fetching optimized gas parameters...");
      const gasOverrides = await getOptimizedGasParams(publicClient);
      console.log("Gas parameters fetched:", gasOverrides);

      // writeContract に渡す引数を構築
      // simulateData.request を基本とし、ガス関連のプロパティのみ上書き
      const writeArgs = {
        ...simulateData.request,
        // gasOverrides の値が存在する場合のみ上書き (bigint は 0n も有効な値なので注意)
        // undefined チェックがより安全
        maxFeePerGas: gasOverrides.maxFeePerGas !== undefined
            ? gasOverrides.maxFeePerGas
            : simulateData.request.maxFeePerGas,
        maxPriorityFeePerGas: gasOverrides.maxPriorityFeePerGas !== undefined
            ? gasOverrides.maxPriorityFeePerGas
            : simulateData.request.maxPriorityFeePerGas,
        // 注意: simulateData.request と gasOverrides の他のプロパティが
        // 衝突しないか、writeContract の型定義を確認してください。
        // 特に 'type' プロパティは request のものを維持することが重要です。
      };
      console.log("Attempting to send transaction with args:", writeArgs);

      // writeContract を呼び出し
      await writeContract(writeArgs);
      console.log("Transaction sent, waiting for confirmation...");

    } catch (err) {
      // writeContract 自体の呼び出し、または内部でのエラー
      console.error('Error sending transaction:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('トランザクション送信中に不明なエラーが発生しました'),
      );
    }
  };

  // ローディング状態の計算 (シミュレーション準備/実行中 or トランザクション確認中)
  const isLoadingSimulate = !!coinParams && !simulateData && !isSimErr && !simulateError;
  const isConfirming = status === 'pending';
  const isSuccess = status === 'success';

  return {
    prepareCoin,
    createCoin,
    // ローディング状態
    isLoading: isLoadingSimulate || isConfirming, // シミュレーション中または確認中
    isSimulating: isLoadingSimulate,              // シミュレーション準備/実行中
    isConfirming: isConfirming,                   // トランザクション確認中
    isSuccess: isSuccess,                         // 成功
    // 結果とエラー
    transactionData: txData as Hash | undefined, // 成功時のトランザクションハッシュ
    error, // エラーオブジェクト (null でなければエラー発生中)
  };
}

/* ─────────────── Trending / New Coins SWR ─────────────── */

// API fetcher 関数 (エラーハンドリング強化)
const makeFetcher = (fallbackMsg: string) => async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`, errorText);
      throw new Error(`${fallbackMsg} (status: ${res.status})`);
    }
    const data = await res.json();
    // APIレスポンスに 'coins' が含まれることを期待、なければ空配列
    return data?.coins ?? [];
  } catch (err) {
    console.error(`Error in fetcher for ${url}:`, err);
    // UI側でエラーにならないよう、エラー時は空配列を返す
    // 必要に応じてエラーオブジェクトを throw するなどの対応も可能
    return [];
  }
};

// SWR の共通オプション
const swrOptions = {
    refreshInterval: 60_000, // 60秒ごとに再検証
    fallbackData: [],        // 初期データ/フォールバックデータ
    revalidateOnFocus: false, // ウィンドウフォーカス時に再検証しない
};

export function useTrendingCoins(count = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/trending?count=${count}`, // APIエンドポイント
    makeFetcher('トレンドコイン取得失敗'),    // fetcher
    swrOptions                       // SWRオプション
  );

  return { coins: data, isLoading, error, refresh: mutate };
}

export function useNewCoins(count = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/coins/new?count=${count}`,      // APIエンドポイント
    makeFetcher('新着コイン取得失敗'),       // fetcher
    swrOptions                          
  );

  return { coins: data, isLoading, error, refresh: mutate };
}
