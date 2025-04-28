'use client';

import { WagmiConfig, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { http } from 'viem';

// 環境に応じたチェーン選択
const isTestnet = process.env.NEXT_PUBLIC_NETWORK_ENVIRONMENT === 'testnet';
const defaultChain = isTestnet ? baseSepolia : base;

// Base ChainのRPC URL
const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';
const baseSepoliaRpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';

// WalletConnect ProjectId
const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || '';

// Wagmi設定
const config = createConfig(
  getDefaultConfig({
    // App情報
    appName: 'Coinspire',
    appDescription: 'トレンド分析と創作支援プラットフォーム',
    appUrl: 'https://coinspire.app',

    // 両方のチェーンをサポート
    chains: [base, baseSepolia],

    // デフォルトのチェーンを環境に応じて設定
    initialChain: defaultChain,

    // WalletConnectのProjectIDを設定
    walletConnectProjectId: walletConnectId,

    // RPC設定
    transports: {
      [base.id]: http(baseRpcUrl),
      [baseSepolia.id]: http(baseSepoliaRpcUrl),
    },
  })
);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        options={{
          language: 'ja' as unknown as any,
          hideBalance: false,
          hideTooltips: false,
          // 必要なチェーンだけを表示
          customChains: isTestnet ? [baseSepolia] : [base],
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}