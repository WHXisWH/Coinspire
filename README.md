# Coinspire

Coinspire is a web3 platform for creators to tokenize and monetize their content using ZORA's Coins Protocol, powered by AI-driven trend analysis and creative support tools.

## 🌐 Demo
https://coinspire.vercel.app

## 🚀 Key Features

- **AI-Powered Trend Analysis**
  - Real-time trend detection across social media, news, and communities
  - Keyword and theme identification
  - Visual style and color palette recommendations

- **Creative Content Generation**
  - AI-suggested templates
  - Trend-based content inspiration
  - Image editing and customization tools

- **Blockchain Tokenization**
  - Seamless coin creation on Base Chain
  - Integration with ZORA Coins Protocol
  - Easy content monetization

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: SWR, React Query
- **Wallet Integration**: ConnectKit, wagmi

### Blockchain
- **Network**: Base Chain (Ethereum L2)
- **Protocol**: ZORA Coins SDK
- **Wallet Connection**: ConnectKit, wagmi

### AI Services
- **Backend**: Python Flask
- **Natural Language Processing**: NLTK
- **Image Analysis**: Custom algorithms

### Storage
- **Media Storage**: IPFS via NFT.Storage

## 🔧 Development Setup

### Prerequisites
- Node.js v18+
- Python v3.9+
- Web3 Wallet (MetaMask recommended)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/coinspire.git
   cd coinspire
   ```

2. Install dependencies
   ```bash
   npm install
   # For AI service
   cd ai && pip install -r requirements.txt
   ```

3. Create `.env.local` file
   ```
   # Example configuration
   NFT_STORAGE_API_KEY=your_nft_storage_key
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   ```

4. Start development server
   ```bash
   npm run dev
   ```

## 🚀 Deployment

- Frontend: Vercel
- AI Service: Docker on Render
- Blockchain: Base Chain

## 🛠️ Current Development Status

- [x] Project architecture
- [x] Core UI components
- [x] ZORA SDK integration
- [x] Trend visualization
- [x] Content creation workflow
- [x] Wallet connection
- [x] IPFS storage
- [x] AI analysis foundation
- 🚧 Advanced trend prediction
- 🚧 Machine learning improvements
- 🚧 Performance optimization

## 📦 Key Dependencies

- `@zoralabs/coins-sdk`
- `wagmi`
- `connectkit`
- `nft.storage`
- `flask`
- `nltk`
- `tensorflow`

## 📄 License

MIT License

---

# Coinspire

Coinspireは、AIによるトレンド分析と創作支援ツールを活用し、ZORAのCoins Protocolを使用してコンテンツをトークン化・収益化するWeb3プラットフォームです。

## 🌐 デモ
https://coinspire.vercel.app

## 🚀 主な機能

- **AIによるトレンド分析**
  - ソーシャルメディア、ニュース、コミュニティのリアルタイムトレンド検出
  - キーワードとテーマの特定
  - ビジュアルスタイルとカラーパレットの推奨

- **クリエイティブコンテンツ生成**
  - AIが提案するテンプレート
  - トレンドに基づくコンテンツインスピレーション
  - 画像編集とカスタマイズツール

- **ブロックチェーンでのトークン化**
  - Base Chainでのコイン作成
  - ZORAのCoins Protocolとの統合
  - コンテンツの簡単な収益化

## 💻 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: SWR, React Query
- **ウォレット統合**: ConnectKit, wagmi

### ブロックチェーン
- **ネットワーク**: Base Chain (Ethereum L2)
- **プロトコル**: ZORA Coins SDK
- **ウォレット接続**: ConnectKit, wagmi

### AIサービス
- **バックエンド**: Python Flask
- **自然言語処理**: NLTK
- **画像分析**: カスタムアルゴリズム

### ストレージ
- **メディアストレージ**: IPFS (NFT.Storage経由)

## 🔧 開発環境セットアップ

### 前提条件
- Node.js v18+
- Python v3.9+
- Web3ウォレット（推奨：MetaMask）

### インストール手順

1. リポジトリをクローン
   ```bash
   git clone https://github.com/yourusername/coinspire.git
   cd coinspire
   ```

2. 依存関係をインストール
   ```bash
   npm install
   # AIサービス用
   cd ai && pip install -r requirements.txt
   ```

3. `.env.local`ファイルを作成
   ```
   # 設定例
   NFT_STORAGE_API_KEY=your_nft_storage_key
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   ```

4. 開発サーバーを起動
   ```bash
   npm run dev
   ```

## 🚀 デプロイメント

- フロントエンド: Vercel
- AIサービス: Docker on Render
- ブロックチェーン: Base Chain

## 🛠️ 現在の開発状況

- [x] プロジェクトアーキテクチャ
- [x] コアUIコンポーネント
- [x] ZORA SDK統合
- [x] トレンド可視化
- [x] コンテンツ作成ワークフロー
- [x] ウォレット接続
- [x] IPFSストレージ
- [x] AI分析基盤
- 🚧 高度なトレンド予測
- 🚧 機械学習の改善
- 🚧 パフォーマンス最適化

## 📦 主要な依存関係

- `@zoralabs/coins-sdk`
- `wagmi`
- `connectkit`
- `nft.storage`
- `flask`
- `nltk`
- `tensorflow`

## 📄 ライセンス

MITライセンス
