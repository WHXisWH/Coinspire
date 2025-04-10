import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@/components/wallet/connect-button';
import { useZoraMint, useZoraCreateCoin } from '@/hooks/useZora';
import { prepareMetadata } from '@/lib/zora';
import { Address } from 'viem';
import { ImageEditor } from '@/components/create/image-editor';
import type { Template } from '@/types/trends';

interface CreationFormProps {
  selectedTemplate?: string | null;
  templateData?: Template | null;
  onContentUpload: (file: File) => void;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  error: string | null;
}

interface FormData {
  title: string;
  symbol: string;
  description: string;
}

export function CreationForm({
  selectedTemplate,
  onContentUpload,
  onSubmit,
  isLoading: propIsLoading,
  error: propError
}: CreationFormProps) {
  const { address, isConnected } = useAccount();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  
  // 直接mintを使う場合
  const { mint, isLoading: mintLoading, error: mintError, result: mintResult } = useZoraMint();
  
  // Wagmi + createCoinCallを使う場合
  const { prepareCoin, createCoin, isLoading: createCoinLoading, transactionData } = useZoraCreateCoin();
  
  // どちらのミント方法を使うか
  const [useDirectMint, setUseDirectMint] = useState(true);
  
  const isLoading = propIsLoading || mintLoading || createCoinLoading;
  const error = propError || mintError;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      symbol: '',
      description: ''
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setFileError('ファイルを選択してください');
      return;
    }
    
    // ファイルタイプ検証
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      setFileError('JPG, PNG, GIF形式の画像ファイルを選択してください');
      return;
    }
    
    // ファイルサイズ検証 (5MB制限)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    // プレビュー更新
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // エラーリセット
    setFileError(null);
    
    // 親コンポーネントに通知
    onContentUpload(file);
  };
  
  const submitForm = async (data: FormData) => {
    if (!previewUrl) {
      setFileError('画像ファイルをアップロードしてください');
      return;
    }
    
    if (!address) {
      return;
    }
    
    setStep('processing');
    
    const file = document.getElementById('file-upload') as HTMLInputElement;
    const content = file?.files?.[0];
    
    if (!content) {
      setFileError('ファイルが見つかりません');
      setStep('form');
      return;
    }
    
    try {
      if (useDirectMint) {
        // 直接mintを使用する方法
        const mintResult = await mint(
          content,
          data.title,
          data.symbol,
          data.description,
          address as Address
        );
        
        if (mintResult?.success) {
          setStep('success');
        } else {
          setStep('form');
        }
      } else {
        // createCoinCallを使用する方法
        const metadataURI = await prepareMetadata(content, data.title, data.description);
        
        prepareCoin({
          name: data.title,
          symbol: data.symbol,
          uri: metadataURI,
          payoutRecipient: address as Address,
          platformReferrer: process.env.NEXT_PUBLIC_PLATFORM_REFERRER_ADDRESS as Address || undefined,
        });
        
        createCoin();
        
        // Note: 実際のアプリケーションでは、トランザクションの成功を監視して
        // ステップを変更する必要があります。ここでは簡略化しています。
      }
    } catch (error) {
      console.error('Error creating coin:', error);
      setStep('form');
    }
  };
  
  if (step === 'success' || mintResult?.success) {
    return (
      <div className="success-container p-6 rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
          成功！コインが作成されました
        </h2>
        
        <p className="mb-4">
          あなたのコインは正常に作成され、取引可能になりました。
        </p>
        
        {mintResult?.address && (
          <div className="mb-4">
            <p className="font-medium">コインアドレス:</p>
            <code className="block p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
              {mintResult.address}
            </code>
          </div>
        )}
        
        {mintResult?.hash && (
          <div className="mb-4">
            <p className="font-medium">トランザクションハッシュ:</p>
            <code className="block p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
              {mintResult.hash}
            </code>
          </div>
        )}
        
        <div className="flex gap-4 mt-6">
          {mintResult?.address && (
            <a
              href={`https://zora.co/base/coins/${mintResult.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Zoraで見る
            </a>
          )}
          
          <button
            onClick={() => {
              setStep('form');
              setPreviewUrl(null);
            }}
            className="btn-secondary px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            新しく作成する
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="creation-form max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">コンテンツ作成とコイン発行</h2>
      
      {/* ウォレット接続チェック */}
      {!isConnected && (
        <div className="wallet-connect-prompt mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md">
          <p className="mb-3 text-yellow-700 dark:text-yellow-300">
            コインを発行するには、ウォレットを接続してください。
          </p>
          <ConnectButton />
        </div>
      )}
      
      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        {/* ファイルアップロード */}
        <div className="file-upload-section">
          <label className="block text-sm font-medium mb-2">
            画像をアップロード
          </label>
          
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            {previewUrl ? (
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={previewUrl}
                  alt="プレビュー"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="text-center p-8">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  ここにファイルをドラッグ&ドロップするか、クリックしてアップロード
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG, GIF (最大5MB)
                </p>
              </div>
            )}
            
            <input 
              type="file" 
              id="file-upload" 
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            
            <button
              type="button"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {previewUrl ? 'ファイルを変更' : 'ファイルを選択'}
            </button>
            
            {fileError && (
              <p className="mt-2 text-sm text-red-500">{fileError}</p>
            )}
          </div>
        </div>
        
        {/* コイン情報 */}
        <div className="coin-info-section">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              コイン名
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
              placeholder="例：My Amazing Art"
              {...register('title', { 
                required: 'コイン名は必須です',
                maxLength: {
                  value: 50,
                  message: 'コイン名は50文字以内で入力してください'
                }
              })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="symbol" className="block text-sm font-medium mb-1">
              シンボル（$記号なし）
            </label>
            <input
              id="symbol"
              type="text"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
              placeholder="例：AMAZING"
              {...register('symbol', { 
                required: 'シンボルは必須です',
                maxLength: {
                  value: 10,
                  message: 'シンボルは10文字以内で入力してください'
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: 'シンボルはアルファベットと数字のみ使用できます'
                }
              })}
            />
            {errors.symbol && (
              <p className="mt-1 text-sm text-red-500">{errors.symbol.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              取引時には自動的に $SYMBOL の形式で表示されます
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              説明
            </label>
            <textarea
              id="description"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 min-h-[120px]"
              placeholder="あなたのコインについての説明を入力してください"
              {...register('description', { 
                required: '説明は必須です',
                maxLength: {
                  value: 500,
                  message: '説明は500文字以内で入力してください'
                }
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
        </div>
        
        {/* 送信ボタン */}
        <div className="form-actions">
          {error && (
            <div className="error-message mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            disabled={isLoading || !isConnected || step === 'processing'}
          >
            {isLoading || step === 'processing' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                処理中...
              </span>
            ) : (
              '作成してコインを発行'
            )}
          </button>
          
          {!isConnected && (
            <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              コインを発行するにはウォレットを接続してください
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
