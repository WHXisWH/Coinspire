# Coinspire

Coinspire is a web application designed to empower creators to tokenize and share their original content as tradable digital assets using the Zora Coins SDK. It combines intuitive UI with powerful AI-driven features to help users launch their own social tokens seamlessly.

## ⛸️ Demo URL
https://coinspire.vercel.app

## 🌟 Project Overview

Coinspire combines AI-driven trend analysis with creator tools to help artists and content creators monetize their work through ZORA's Coins Protocol. The platform analyzes current trends across social media, news, and communities, then provides creators with inspiration and templates to create content that resonates with audiences.

## 🚀 Key Features

- **AI Trend Analysis Engine**: Collects and analyzes data from social media, news sites, and communities to identify emerging trends
- **Creative Support System**: Suggests templates, styles, and elements based on trend analysis
- **ZORA Coins Integration**: Seamlessly tokenize created content using ZORA's Coins Protocol
- **Interactive Dashboard**: Visualize current trends and popular coins in an intuitive interface
- **Wallet Integration**: Connect with major Web3 wallets to mint and manage coins

## 💻 Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: Base Chain (Ethereum L2), ZORA Coins Protocol
- **AI**: Python, Natural Language Processing, Image Analysis
- **Storage**: IPFS (via NFT.Storage)
- **Wallet Integration**: ConnectKit, wagmi

## 🔧 Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Python**: v3.9 or higher (for AI services)
- **Web3 Wallet**: MetaMask or any wallet compatible with ConnectKit

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Essential
NFT_STORAGE_API_KEY=your_nft_storage_api_key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_PLATFORM_REFERRER_ADDRESS=your_platform_address

# Optional during development (uses mock data)
NEXT_PUBLIC_WALLET_CONNECT_ID=your_wallet_connect_id
```

#### Required API Keys:

- **NFT.Storage API Key**: Required for IPFS functionality. Get one from [NFT.Storage](https://nft.storage).

See `.env.local.example` for a complete list of available environment variables.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/coinspire.git
   cd coinspire
   ```

2. Install dependencies:
   ```bash
   npm install
   # If using the AI service locally
   cd ai && pip install -r requirements.txt
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Current Development Status

This project is under active development as part of the ZORA WaveHack. Current progress:

- ✅ Project structure and architecture design
- ✅ Core UI components implementation
- ✅ ZORA SDK integration
- ✅ Basic trend visualization
- ✅ Content creation workflow
- ✅ Wallet connection and transaction handling
- ✅ IPFS storage integration
- ✅ AI analysis engine foundation
- 🚧 Advanced trend analysis
- 🚧 Machine learning model training
- 🚧 User testing and UX improvements
- 🚧 Performance optimization

## 📝 Notes

- During development with mock data enabled (`NEXT_PUBLIC_ENABLE_MOCK_DATA=true`), most features will work without external API services.
- The ZORA Coins SDK may display warnings about missing API keys in the console - these can be safely ignored during development.
- For IPFS functionality, a valid NFT.storage API key is required.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

# Coinspire (日本語)

CoinspireはZORA Coins Protocol上に構築された、AIを活用したトレンド分析と創作支援プラットフォームです。

## 🌟 プロジェクト概要

Coinspireは、AIによるトレンド分析とクリエイターツールを組み合わせ、アーティストやコンテンツクリエイターがZORAのCoins Protocolを通じて作品を収益化するサポートをします。プラットフォームはソーシャルメディア、ニュース、コミュニティ全体の現在のトレンドを分析し、クリエイターに視聴者の共感を得るコンテンツを作成するためのインスピレーションとテンプレートを提供します。

## 🚀 主な機能

- **AIトレンド分析エンジン**: ソーシャルメディア、ニュースサイト、コミュニティからデータを収集・分析し、新たなトレンドを特定
- **創作支援システム**: トレンド分析に基づいたテンプレート、スタイル、要素の提案
- **ZORA Coins統合**: ZORAのCoins Protocolを使用して作成したコンテンツをシームレスにトークン化
- **インタラクティブダッシュボード**: 直感的なインターフェースで現在のトレンドと人気のコインを可視化
- **ウォレット統合**: 主要なWeb3ウォレットと接続してコインの発行と管理

## 💻 技術スタック

- **フロントエンド**: Next.js, React, TypeScript, Tailwind CSS
- **ブロックチェーン**: Base Chain (Ethereum L2), ZORA Coins Protocol
- **AI**: Python, 自然言語処理, 画像解析
- **ストレージ**: IPFS (NFT.Storage経由)
- **ウォレット統合**: ConnectKit, wagmi

## 🔧 開発環境のセットアップ

### 前提条件

- **Node.js**: v18.0.0以上
- **Python**: v3.9以上 (AIサービス用)
- **Web3ウォレット**: MetaMaskまたはConnectKitと互換性のあるウォレット

### 環境変数

ルートディレクトリに`.env.local`ファイルを作成し、以下の変数を設定します：

```
# 必須
NFT_STORAGE_API_KEY=your_nft_storage_api_key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_PLATFORM_REFERRER_ADDRESS=your_platform_address

# 開発中はオプション（モックデータを使用）
NEXT_PUBLIC_WALLET_CONNECT_ID=your_wallet_connect_id
```

#### 必要なAPIキー：

- **NFT.Storage APIキー**: IPFS機能に必要です。[NFT.Storage](https://nft.storage)から取得してください。

利用可能な環境変数の完全なリストは`.env.local.example`を参照してください。

### インストール

1. リポジトリをクローンします：
   ```bash
   git clone https://github.com/yourusername/coinspire.git
   cd coinspire
   ```

2. 依存関係をインストールします：
   ```bash
   npm install
   # AIサービスをローカルで使用する場合
   cd ai && pip install -r requirements.txt
   ```

3. 開発サーバーを起動します：
   ```bash
   npm run dev
   ```

4. ブラウザで[http://localhost:3000](http://localhost:3000)を開きます。

## 📊 現在の開発状況

このプロジェクトはZORA WaveHackの一環として積極的に開発中です。現在の進捗：

- ✅ プロジェクト構造とアーキテクチャ設計
- ✅ コアUIコンポーネントの実装
- ✅ ZORA SDK統合
- ✅ 基本的なトレンド視覚化
- ✅ コンテンツ作成ワークフロー
- ✅ ウォレット接続とトランザクション処理
- ✅ IPFSストレージ統合
- ✅ AI分析エンジンの基盤
- 🚧 高度なトレンド分析
- 🚧 機械学習モデルのトレーニング
- 🚧 ユーザーテストとUX改善
- 🚧 パフォーマンス最適化

## 📝 注意事項

- モックデータが有効（`NEXT_PUBLIC_ENABLE_MOCK_DATA=true`）な開発中は、ほとんどの機能が外部APIサービスなしで動作します。
- ZORA Coins SDKはコンソールでAPIキーがない警告を表示することがありますが、開発中は安全に無視できます。
- IPFS機能には、有効なNFT.storage APIキーが必要です。

## 🤝 貢献

貢献は歓迎します！お気軽にプルリクエストを送信してください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で提供されています - 詳細はLICENSEファイルを参照してください。
