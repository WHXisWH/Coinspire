'use client';

import { WagmiConfig, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { http } from 'viem';

const isTestnet =
  process.env.NEXT_PUBLIC_NETWORK_ENVIRONMENT === 'testnet';

const walletConnectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? '';

const baseRpcUrl =
  process.env.NEXT_PUBLIC_BASE_RPC_URL ?? 'https://mainnet.base.org';
const baseSepoliaRpcUrl =
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ??
  'https://sepolia.base.org';

/* ───── wagmi & ConnectKit 共通設定 ───── */
const config = createConfig(
  getDefaultConfig({
    appName: 'Coinspire',
    appDescription: 'トレンド分析と創作支援プラットフォーム',
    appUrl: 'https://coinspire.app',

    /* 利用可能チェーン（UI でも自動反映） */
    chains: [base, baseSepolia],

    /* RPC Transport */
    transports: {
      [base.id]: http(baseRpcUrl),
      [baseSepolia.id]: http(baseSepoliaRpcUrl),
    },

    /* WalletConnect */
    walletConnectProjectId: walletConnectId,
  }),
);

/* ───── Provider ───── */
export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        options={{
          /* ✅ ConnectKitProvider 側は initialChainId で指定 */
          initialChainId: isTestnet ? baseSepolia.id : base.id,
          language: 'ja' as any,
          hideBalance: false,
          hideTooltips: false,
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
