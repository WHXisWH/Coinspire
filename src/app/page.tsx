import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* ヒーローセクション */}
      <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-gray-800 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-medium mb-6">
            ZORAのCoins Protocolで簡単にトークン化
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            クリエイターのための
            <span className="text-gradient-primary block md:inline"> トレンド分析とコイン発行 </span>
            プラットフォーム
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Coinspireは、AIがトレンドを分析し、インスピレーションを提供。あなたの創作を
            ZORAのCoins Protocolでトークン化します。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link 
              href="/dashboard" 
              className="btn-primary px-8 py-3 rounded-lg font-medium text-lg"
            >
              トレンドを見る
            </Link>
            <Link 
              href="/create" 
              className="btn-secondary px-8 py-3 rounded-lg font-medium text-lg"
            >
              創作を始める
            </Link>
          </div>
          
          {/* 視覚的な装飾要素 */}
          <div className="relative h-16 mt-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg width="500" height="44" viewBox="0 0 500 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                <path d="M499 22C499 25.866 496.134 29 492.5 29C488.866 29 486 25.866 486 22C486 18.134 488.866 15 492.5 15C496.134 15 499 18.134 499 22ZM0.5 22.5H492.5V21.5H0.5V22.5Z" fill="#6366F1"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      {/* 特徴セクション */}
      <section className="w-full py-16 px-4 md:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Web3クリエイターのための<span className="text-primary-600 dark:text-primary-400">ユニークな機能</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card p-6 rounded-2xl bg-white shadow-soft dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="icon-wrapper mb-6 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AIトレンド分析</h3>
              <p className="text-gray-600 dark:text-gray-400">
                SNS、ニュース、コミュニティから最新トレンドをAIが抽出し、市場の動向を把握できます。人気のキーワードやテーマをリアルタイムで確認しましょう。
              </p>
            </div>
            
            <div className="feature-card p-6 rounded-2xl bg-white shadow-soft dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="icon-wrapper mb-6 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">インスピレーション提供</h3>
              <p className="text-gray-600 dark:text-gray-400">
                分析結果に基づいたアイデアやテンプレートを提案。流行りのテーマやカラーパレット、スタイルなど、創作のきっかけをCoinspireが提供します。
              </p>
            </div>
            
            <div className="feature-card p-6 rounded-2xl bg-white shadow-soft dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="icon-wrapper mb-6 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">簡単コイン発行</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ZORAのCoins Protocolを使って数クリックで収益化可能に。あなたの創作物をトークン化し、ファンやコレクターとの新しい関係を構築しましょう。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 使い方セクション */}
      <section className="w-full py-16 px-4 md:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">簡単<span className="text-primary-600 dark:text-primary-400">3ステップ</span>で始められます</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Coinspireを使って、あなたのクリエイティブなアイデアをトークン化しましょう
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="step-card p-6 rounded-2xl bg-white shadow-sm dark:bg-gray-700 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">1</div>
              <h3 className="text-xl font-semibold mb-3 mt-2">トレンドを確認</h3>
              <p className="text-gray-600 dark:text-gray-300">
                ダッシュボードで最新のトレンドやキーワード、人気のテーマやスタイルを確認します。
              </p>
            </div>
            
            <div className="step-card p-6 rounded-2xl bg-white shadow-sm dark:bg-gray-700 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">2</div>
              <h3 className="text-xl font-semibold mb-3 mt-2">コンテンツを作成</h3>
              <p className="text-gray-600 dark:text-gray-300">
                分析結果に基づいたテンプレートを使って、オリジナルのコンテンツを作成します。
              </p>
            </div>
            
            <div className="step-card p-6 rounded-2xl bg-white shadow-sm dark:bg-gray-700 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">3</div>
              <h3 className="text-xl font-semibold mb-3 mt-2">コインを発行</h3>
              <p className="text-gray-600 dark:text-gray-300">
                完成したコンテンツをZORAのCoins Protocolでトークン化し、収益を得ることができます。
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/dashboard" 
              className="btn-primary px-8 py-3 rounded-lg font-medium text-lg inline-flex items-center"
            >
              <span>今すぐ始める</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">創作とトークン化の新しい時代へ</h2>
          <p className="text-xl mb-8 text-white/90">
            トレンドを分析し、創作を支援し、収益化を実現する。Coinspireで新しいクリエイターエコノミーの扉を開きましょう。
            <br />
            <a 
              href="https://zora.co" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline text-white hover:text-white/80"
            >
              ZORAについてはこちら
            </a>
          </p>
          <div className="text-center mt-6">
            <Link 
              href="/dashboard" 
              className="btn-primary px-8 py-3 rounded-lg font-medium text-lg inline-flex items-center"
            >
              無料で始める
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ブログセクション */}
      <section className="w-full py-16 px-4 md:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">最新情報</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Web3クリエイションとCoinsプロトコルに関する最新のニュースとインサイト
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="blog-card rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-card border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">2025年3月30日</span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full">ニュース</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">ZORAのCoins Protocolがクリエイターエコノミーに革命を</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  ZORAのCoins Protocolがどのようにクリエイターとファンの関係性を変革し、新しい収益モデルを生み出しているのかを解説します。
                </p>
                <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline inline-flex items-center">
                  <span>続きを読む</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="blog-card rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-card border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">2025年3月25日</span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300 px-2 py-1 rounded-full">チュートリアル</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AIを活用したクリエイティブワークフローの構築方法</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  AIツールを効果的に活用して、クリエイティブなワークフローを最適化する方法と、作品の質を向上させるテクニックを紹介。
                </p>
                <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline inline-flex items-center">
                  <span>続きを読む</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="blog-card rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-card border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">2025年3月20日</span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">事例紹介</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">成功事例：コインを使ってコミュニティを構築した5人のクリエイター</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  ZORAのCoins Protocolを活用して、独自のコミュニティと収益モデルを構築した5人のクリエイターの成功事例を紹介します。
                </p>
                <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline inline-flex items-center">
                  <span>続きを読む</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
