import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">利用規約</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. はじめに</h2>
          <p>
            このウェブサイト（以下「本サービス」）をご利用いただくことにより、あなたはこの利用規約に同意したことになります。
            本サービスを利用する前に、この利用規約をよくお読みください。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. サービスの説明</h2>
          <p>
            Coinspireは、AIを活用したトレンド分析と創作支援プラットフォームです。ZORAのCoins Protocolを利用して、ユーザーのデジタルコンテンツをトークン化し、収益化をサポートします。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. アカウント</h2>
          <p>
            本サービスの一部の機能を利用するには、ブロックチェーンウォレットの接続が必要となります。ウォレットの安全な管理はユーザー自身の責任となります。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. 利用制限</h2>
          <p>
            以下の行為は禁止されています：
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>違法なコンテンツの作成や共有</li>
            <li>他者の知的財産権を侵害するコンテンツの作成</li>
            <li>サービスの不正利用やセキュリティの侵害</li>
            <li>他のユーザーへの嫌がらせや迷惑行為</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. 知的財産権</h2>
          <p>
            ユーザーが本サービスを通じて作成したコンテンツの知的財産権は、そのユーザーに帰属します。ただし、本サービスを通じてコンテンツをトークン化した場合、関連するスマートコントラクトの条件に従って権利が分配される場合があります。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. 免責事項</h2>
          <p>
            本サービスは「現状有姿」で提供され、いかなる種類の保証もありません。当社は、サービスの中断、エラー、情報の損失などについて責任を負いません。
          </p>
          <p className="mt-2">
            ブロックチェーンやスマートコントラクトに関連するリスクは、ユーザー自身が負担するものとします。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. 変更</h2>
          <p>
            当社は、いつでもこの利用規約を変更する権利を留保します。変更後も本サービスを継続して利用した場合、変更後の規約に同意したものとみなされます。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. 連絡先</h2>
          <p>
            本利用規約に関するご質問は、以下のアドレスまでお問い合わせください。
          </p>
          <p className="mt-2">
            support@coinspire.example.com
          </p>
        </section>
      </div>
      
      <div className="mt-10 pb-6">
        <Link href="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
