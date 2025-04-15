import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. はじめに</h2>
          <p>
            Coinspire（以下「当社」または「私たち」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
            このプライバシーポリシーは、当社がどのように情報を収集、使用、共有するかについて説明しています。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. 収集する情報</h2>
          <p>
            当社は以下の情報を収集することがあります：
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>ブロックチェーンウォレットアドレス</li>
            <li>アップロードされたコンテンツとメタデータ</li>
            <li>サービス利用に関する統計データ</li>
            <li>IPアドレスやデバイス情報などの技術データ</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. 情報の使用目的</h2>
          <p>
            収集した情報は、以下の目的で使用されます：
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>サービスの提供と改善</li>
            <li>ユーザー認証とアカウント管理</li>
            <li>カスタマーサポートの提供</li>
            <li>トレンド分析と創作支援機能の向上</li>
            <li>サービスのセキュリティ維持</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. 情報の共有</h2>
          <p>
            当社は、以下の場合を除き、ユーザーの個人情報を第三者と共有しません：
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>サービス提供に必要なパートナー（ZORA等）との共有</li>
            <li>法的要件に基づく開示が必要な場合</li>
            <li>当社の権利や財産を保護する必要がある場合</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. ブロックチェーン上の情報</h2>
          <p>
            ブロックチェーン上に記録された情報（トランザクション、トークンメタデータなど）は公開され、削除できない可能性があることにご注意ください。このようなデータの公開性はブロックチェーン技術の特性によるものです。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. データセキュリティ</h2>
          <p>
            当社は、収集した情報を保護するために適切なセキュリティ対策を実施していますが、インターネットやブロックチェーン上のデータ転送は100%安全ではないことをご理解ください。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. ユーザーの権利</h2>
          <p>
            ユーザーには以下の権利があります：
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>個人情報へのアクセス</li>
            <li>不正確な情報の訂正</li>
            <li>特定の状況下での情報の削除依頼</li>
            <li>情報処理の制限依頼</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. クッキーとトラッキング技術</h2>
          <p>
            当社のウェブサイトでは、サービス改善のためにクッキーなどのトラッキング技術を使用することがあります。ブラウザの設定を変更することで、これらの技術の使用を制限または拒否できますが、一部のサービス機能が正常に動作しなくなる可能性があります。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">9. プライバシーポリシーの変更</h2>
          <p>
            当社は、このプライバシーポリシーを随時更新することがあります。重要な変更がある場合は、ウェブサイト上で通知します。
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">10. お問い合わせ</h2>
          <p>
            このプライバシーポリシーに関するご質問や懸念がある場合は、以下の連絡先までお問い合わせください：
          </p>
          <p className="mt-2">
            privacy@coinspire.example.com
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
