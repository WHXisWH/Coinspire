import { PublicClient } from 'viem';

/**
 * EIP-1559に準拠したガスパラメータを計算
 * @param publicClient viem PublicClient
 * @param priorityFeeBuffer 優先手数料のバッファ率（割合）
 * @param maxFeeBuffer 最大手数料のバッファ率（割合）
 * @returns 計算されたガスパラメータ
 */
export async function calculateEIP1559Gas(
  publicClient: PublicClient,
  priorityFeeBuffer: number = 0.3, // 30%
  maxFeeBuffer: number = 0.3 // 30%
) {
  try {
    // 現在のブロックを取得
    const block = await publicClient.getBlock();
    
    // baseFeePerGasが存在することを確認
    if (!block.baseFeePerGas) {
      throw new Error('baseFeePerGas is not available');
    }
    
    // 優先手数料の推定（gwei）
    const priorityFeeHistory = await publicClient.estimateMaxPriorityFeePerGas();
    
    // バッファを適用（オーバーペイ防止のための調整）
    const adjustedPriorityFee = priorityFeeHistory * BigInt(100 + priorityFeeBuffer * 100) / BigInt(100);
    
    // 基本手数料にバッファを適用
    const baseFeeWithBuffer = block.baseFeePerGas * BigInt(100 + maxFeeBuffer * 100) / BigInt(100);
    
    // 最大手数料を計算（基本手数料 + 優先手数料 + バッファ）
    const maxFeePerGas = baseFeeWithBuffer + adjustedPriorityFee;
    
    return {
      maxFeePerGas,
      maxPriorityFeePerGas: adjustedPriorityFee
    };
  } catch (error) {
    console.error('Error calculating gas parameters:', error);
    throw error;
  }
}

/**
 * 最適なガスパラメータを取得して設定
 * @param publicClient viem PublicClient
 * @returns トランザクション送信用のガスパラメータ
 */
export async function getOptimizedGasParams(publicClient: PublicClient) {
  try {
    const gasParams = await calculateEIP1559Gas(publicClient);
    return {
      maxFeePerGas: gasParams.maxFeePerGas,
      maxPriorityFeePerGas: gasParams.maxPriorityFeePerGas
    };
  } catch (error) {
    console.warn('Failed to calculate optimized gas, using default estimation:', error);
    // デフォルトのガス設定にフォールバック
    return {};
  }
}