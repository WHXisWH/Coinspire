import { useState, useEffect } from 'react';
import { usePublicClient, useWalletClient, useSimulateContract, useWriteContract } from 'wagmi';
import type { Config } from 'wagmi';
import { createContentCoin } from '@/lib/zora';
import { createCoinCall } from "@zoralabs/coins-sdk";
import type { Address, SimulateContractParameters, Chain, Account } from 'viem';
import type { CreateCoinParams } from '@/types/zora';
import useSWR from 'swr';
import { getOptimizedGasParams } from '@/utils/gas';


export function useZoraMint() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; hash?: string; address?: Address } | null>(null);

  const mint = async (
    content: File,
    title: string,
    symbol: string,
    description: string,
    creatorAddress: Address
  ) => {
    if (!walletClient || !walletClient.account || !publicClient) {
      setError('ウォレットが接続されていません。ウォレットを接続してからもう一度お試しください。'); 
      return null;
    }
    
    // 入力検証
    if (!content) {
      setError('コンテンツファイルが選択されていません');
      return null;
    }
    
    if (!title || !symbol || !description) {
      setError('コイン情報が不完全です。タイトル、シンボル、説明文を入力してください。');
      return null;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating coin with parameters:', {
        title,
        symbol, 
        description,
        creatorAddress
      });
      
      // 最適化されたガスパラメータを取得
      const gasParams = await getOptimizedGasParams(publicClient);
      console.log("Using optimized gas parameters:", gasParams);
      
      const mintResult = await createContentCoin(
        walletClient,
        publicClient,
        {
          content,
          title,
          symbol,
          description,
          creatorAddress,
        },
        { gas: gasParams } // ガスパラメータを渡す
      );
      
      console.log('Mint result:', mintResult);
      
      if (!mintResult.success && mintResult.error) {
        setError(mintResult.error);
        return null;
      }
      
      setResult(mintResult);
      return mintResult;
    } catch (err: any) {
      console.error('Error in mint function:', err);
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
    result,
  };
}


export function useZoraCreateCoin() {
  const [coinParams, setCoinParams] = useState<CreateCoinParams | null>(null);
  const [simulateConfig, setSimulateConfig] = useState<SimulateContractParameters | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!coinParams) {
      setSimulateConfig(undefined);
      return;
    }
    let isMounted = true;

    (async () => {
      try {
        console.log('Preparing coin creation with params:', coinParams);
        
        const callResult = await createCoinCall(coinParams);
        console.log("createCoinCall result:", callResult);

        if (callResult && callResult.address && callResult.abi && callResult.functionName && callResult.args) {
            const configForSimulate: SimulateContractParameters = {
              address: callResult.address,
              abi: callResult.abi,
              functionName: callResult.functionName,
              args: callResult.args,
            };

            // 最適化されたガスパラメータを取得
            const gasParams = await getOptimizedGasParams(publicClient);
            console.log("Using optimized gas parameters for simulation:", gasParams);

            if (coinParams.initialPurchaseWei) {
              configForSimulate.value = coinParams.initialPurchaseWei;
            }
            
            // ガスパラメータを追加
            configForSimulate.gas = gasParams;

            if (isMounted) {
              setSimulateConfig(configForSimulate);
              setError(null);
            }
        } else {
            console.error("Failed to construct simulate config: Missing required properties from createCoinCall result or callResult is null/undefined", callResult);
            if (isMounted) {
              setSimulateConfig(undefined);
              setError(new Error("コイン作成の準備に失敗しました。必要なパラメータが不足しています。"));
            }
        }

      } catch (err) {
        console.error("createCoinCall failed:", err);
         if (isMounted) {
           setSimulateConfig(undefined);
           setError(err instanceof Error ? err : new Error("コイン作成の準備中にエラーが発生しました"));
         }
      }
    })();

    return () => {
        isMounted = false;
    };
  }, [coinParams, publicClient]);

  const { data: simulateData, error: simulateError } = useSimulateContract(simulateConfig);
  const { writeContract, status, data: txData, error: writeError } = useWriteContract();

  useEffect(() => {
      if (simulateError) {
          console.error("Simulation Error:", simulateError);
          setError(simulateError);
      }
      if (writeError) {
          console.error("Write Contract Error:", writeError);
          setError(writeError);
      }
  }, [simulateError, writeError]);

  const prepareCoin = (params: CreateCoinParams) => {
    console.log('Preparing coin with parameters:', params);
    setCoinParams(params);
  };

  const createCoin = async () => {
    if (simulateData?.request && writeContract) {
      console.log('Executing coin creation with simulation data:', simulateData.request);
      
      try {
        // 最適化されたガスパラメータを取得
        const gasParams = await getOptimizedGasParams(publicClient);
        console.log("Using optimized gas parameters for transaction:", gasParams);
        
        // シミュレーションデータにガスパラメータを追加
        const requestWithGas = {
          ...simulateData.request,
          gas: {
            ...simulateData.request.gas,
            ...gasParams
          }
        };
        
        writeContract(requestWithGas);
      } catch (err) {
        console.error("Error preparing gas parameters:", err);
        // エラーが発生した場合は元のリクエストを使用
        writeContract(simulateData.request);
      }
    } else {
        if (simulateError) {
             console.error("Cannot create coin due to simulation error:", simulateError);
             setError(simulateError);
        } else {
             const errorMsg = "コイン作成のシミュレーションに失敗しました。パラメータを確認してください。";
             console.error(errorMsg, { simulateData, writeContractAvailable: !!writeContract });
             setError(new Error(errorMsg));
        }
    }
  };

  return {
    prepareCoin,
    createCoin,
    isLoading: status === 'pending' || (!!coinParams && !simulateConfig && !simulateError),
    isSimulating: !!coinParams && !simulateConfig && !simulateError,
    isConfirming: status === 'pending',
    isSuccess: status === 'success',
    transactionData: txData,
    error: error || simulateError || writeError,
  };
}


export function useTrendingCoins(count = 10) {
    const fetcher = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('トレンドコインの取得に失敗しました');
        }
        const data = await response.json();
        return data.coins || [];
      } catch (error) {
        console.error('Error fetching trending coins:', error);
        return [];
      }
    };

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
      coins: data || [],
      isLoading,
      error,
      refresh: mutate
    };
}

export function useNewCoins(count = 10) {
    const fetcher = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('新着コインの取得に失敗しました');
        }
        const data = await response.json();
        return data.coins || [];
      } catch (error) {
        console.error('Error fetching new coins:', error);
        return [];
      }
    };

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
      coins: data || [],
      isLoading,
      error,
      refresh: mutate
    };
}