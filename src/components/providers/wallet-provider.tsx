'use client';

import { WagmiConfig, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

// WalletConnect ProjectIdが環境変数にある場合は使用
const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || '';

// Base ChainのRPC URLが環境変数にある場合は使用
const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

// Wagmi設定
const config = createConfig(
  getDefaultConfig({
    // App情報
    appName: 'Coinspire', 
    appDescription: 'トレンド分析と創作支援プラットフォーム',
    appUrl: 'https://coinspire.app',

    // 必要なチェーンを指定
    chains: [base],

    // WalletConnectのProjectIDを設定
    walletConnectProjectId: walletConnectId,

    // 必要ならAlchemyIdも設定
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,


    transports: {
      [base.id]: baseRpcUrl,
    },
  })
);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        options={{
          language: 'ja', // 日本語表示
          hideBalance: false,
          hideTooltips: false,
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
