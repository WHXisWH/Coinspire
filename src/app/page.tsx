import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          クリエイターのための
          <span className="text-gradient-primary block md:inline">トレンド分析とコイン発行</span>
          プラットフォーム
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
          Coinspireは、AIがトレンドを分析し、インスピレーションを提供。あなたの創作を
          ZORAのCoins Protocolでトークン化します。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/dashboard" 
            className="btn-primary px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            トレンドを見る
          </Link>
          <Link 
            href="/create" 
            className="btn-secondary px-6 py-3 rounded-lg font-medium text-blue-600 border border-blue-600 hover:bg-blue-50"
          >
            創作を始める
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card p-6 rounded-xl bg-white shadow-md dark:bg-gray-800">
            <div className="icon-wrapper mb-4">
              {/* アイコン */}
            </div>
            <h3 className="text-xl font-semibold mb-2">トレンド分析</h3>
            <p className="text-gray-600 dark:text-gray-400">
              SNS、ニュース、コミュニティから最新トレンドをAIが抽出
            </p>
          </div>
          
          <div className="feature-card p-6 rounded-xl bg-white shadow-md dark:bg-gray-800">
            <div className="icon-wrapper mb-4">
              {/* アイコン */}
            </div>
            <h3 className="text-xl font-semibold mb-2">インスピレーション提供</h3>
            <p className="text-gray-600 dark:text-gray-400">
              分析結果に基づいたアイデアやテンプレートを提案
            </p>
          </div>
          
          <div className="feature-card p-6 rounded-xl bg-white shadow-md dark:bg-gray-800">
            <div className="icon-wrapper mb-4">
              {/* アイコン */}
            </div>
            <h3 className="text-xl font-semibold mb-2">コイン発行</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ZORAのCoins Protocolを使って数クリックで収益化可能に
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
