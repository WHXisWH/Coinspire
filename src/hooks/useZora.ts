import { useState, useEffect } from 'react';
import { usePublicClient, useWalletClient, useSimulateContract, useWriteContract } from 'wagmi';
import type { Config } from 'wagmi';
import { createContentCoin } from '@/lib/zora';
import { createCoinCall } from "@zoralabs/coins-sdk";
import type { Address, SimulateContractParameters, Chain, Account } from 'viem';
import type { CreateCoinParams } from '@/types/zora';
import useSWR from 'swr';

// useZoraMint hook (No changes)
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
    if (!walletClient || !publicClient) {
      setError('Wallet not connected'); // Changed to English
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
          creatorAddress,
        }
      );
      setResult(mintResult);
      return mintResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Error occurred during coin creation'; // Changed to English
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

// useZoraCreateCoin hook (Corrected)
export function useZoraCreateCoin() {
  const [coinParams, setCoinParams] = useState<CreateCoinParams | null>(null);
  const [simulateConfig, setSimulateConfig] = useState<SimulateContractParameters | undefined>(undefined);

  useEffect(() => {
    if (!coinParams) {
      setSimulateConfig(undefined);
      return;
    }
    let isMounted = true;

    (async () => {
      try {
        const callResult = await createCoinCall(coinParams);
        console.log("createCoinCall result:", callResult);

        if (callResult && callResult.address && callResult.abi && callResult.functionName && callResult.args) {

            // Prepare the config object with essential properties
            const configForSimulate: SimulateContractParameters = {
              address: callResult.address,
              abi: callResult.abi,
              functionName: callResult.functionName,
              args: callResult.args,
            };

            // Do not explicitly set 'account' or 'chain'.
            // useSimulateContract will automatically use the connected wallet's account and chain.

            // Add 'value' if initialPurchaseWei exists
            if (coinParams.initialPurchaseWei) {
              configForSimulate.value = coinParams.initialPurchaseWei;
            }

            if (isMounted) {
              setSimulateConfig(configForSimulate);
            }
        } else {
            console.error("Failed to construct simulate config: Missing required properties from createCoinCall result or callResult is null/undefined", callResult);
            if (isMounted) {
              setSimulateConfig(undefined);
            }
        }

      } catch (err) {
        console.error("createCoinCall failed:", err);
         if (isMounted) {
           setSimulateConfig(undefined);
         }
      }
    })();

    return () => {
        isMounted = false;
    };
  }, [coinParams]);

  const { data: simulateData, error: simulateError } = useSimulateContract(simulateConfig);
  const { writeContract, status, data: txData, error: writeError } = useWriteContract();

  useEffect(() => {
      if (simulateError) {
          console.error("Simulation Error:", simulateError);
      }
      if (writeError) {
          console.error("Write Contract Error:", writeError);
      }
  }, [simulateError, writeError]);

  const prepareCoin = (params: CreateCoinParams) => {
    setCoinParams(params);
  };

  const createCoin = () => {
    if (simulateData?.request && writeContract) {
      writeContract(simulateData.request);
    } else {
        // Added check for simulateError to provide better context
        if (simulateError) {
             console.error("Cannot create coin due to simulation error:", simulateError);
        } else {
             console.error("Cannot create coin: Simulation data request or writeContract function is not available.", { simulateData, writeContractAvailable: !!writeContract });
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
    error: simulateError || writeError,
  };
}


// useTrendingCoins hook (No changes)
export function useTrendingCoins(count = 10) {
    const fetcher = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch trending coins');
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

// useNewCoins hook (No changes)
export function useNewCoins(count = 10) {
    const fetcher = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch new coins');
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