import { Inter } from 'next/font/google';
import { WalletProvider } from '@/components/providers/wallet-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Coinspire - トレンド分析と創作支援',
  description: 'AIでトレンドを分析し、ZORAのCoins Protocolで収益化',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <WalletProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
