// Coin作成パラメータの型
import { Address } from "viem";

export interface CreateCoinParams {
  name: string;
  symbol: string;
  uri: string;
  payoutRecipient: Address;
  platformReferrer?: Address;
  initialPurchaseWei?: bigint;
  owners?: Address[];
  tickLower?: number;
}

// コインの詳細情報
export interface CoinDetails {
  id: string;
  name: string;
  description: string;
  address: string;
  symbol: string;
  createdAt: string;
  creatorAddress: string;
  marketCap: string;
  volume24h: string;
  mediaUrl?: string;
  imageUrl?: string;
  creatorProfile?: string;
  handle?: string;
}

// トレード方向
export type TradeDirection = 'buy' | 'sell';

// トレードパラメータ
export interface TradeParams {
  direction: TradeDirection;
  target: string;
  args: {
    recipient: string;
    orderSize: bigint;
    minAmountOut?: bigint;
    sqrtPriceLimitX96?: bigint;
  };
  tradeReferrer?: string;
}
