interface ProfilePageProps {
  params: { address: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { address } = params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded p-6">
        <h1 className="text-3xl font-bold mb-4">プロフィールページ</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          ウォレットアドレス:
          <span className="font-mono ml-2 text-blue-600">{address}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          ここにユーザーの詳細なプロフィール情報を表示します。
        </p>
      </div>
    </div>
  );
}
