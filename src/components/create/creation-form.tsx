import { useState, useEffect } from 'react';
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
  templateData,
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: templateData?.name || '',
      symbol: templateData?.name ? templateData.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase() : '',
      description: templateData?.description || ''
    }
  });
  
  // テンプレートの変更を監視
  useEffect(() => {
    if (templateData) {
      setValue('title', templateData.name || '');
      setValue('symbol', templateData.name ? templateData.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase() : '');
      setValue('description', templateData.description || '');
    }
  }, [templateData, setValue]);
  
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
          onSubmit(data);
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
        onSubmit(data);
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
              className="btn-primary px-4 py-2 rounded"
            >
              Zoraで見る
            </a>
          )}
          
          <button
            onClick={() => {
              setStep('form');
              setPreviewUrl(null);
            }}
            className="btn-secondary px-4 py-2 rounded"
          >
            新しく作成する
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="creation-form max-w-3xl mx-auto">
      {/* ウォレット接続チェック */}
      {!isConnected && (
        <div className="wallet-connect-prompt mb-6 p-5 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-100 dark:border-primary-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-3 text-primary-800 dark:text-primary-300 font-medium">
                コインを発行するには、ウォレットを接続してください。
              </p>
              <ConnectButton />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(submitForm)} className="space-y-8">
        {/* ファイルアップロード */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            画像をアップロード
          </h3>
          
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            {previewUrl ? (
              <div className="relative w-full h-64 mb-4 overflow-hidden rounded-md shadow-sm">
                <Image
                  src={previewUrl}
                  alt="プレビュー"
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                  >
                    削除
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <svg 
                  className="mx-auto h-16 w-16 text-gray-400" 
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
                <p className="mt-4 text-gray-600 dark:text-gray-400 mb-2">
                  ファイルをドラッグ&ドロップするか
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  PNG, JPG, GIF (最大5MB)
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  ファイルを選択
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              id="file-upload" 
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            
            {fileError && (
              <div className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md border border-red-200 dark:border-red-800 flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{fileError}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* コイン情報 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            コイン詳細
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                コイン名 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`input-field ${errors.title ? 'input-error' : ''}`}
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
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {errors.title.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                シンボル（$記号なし） <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="symbol"
                  type="text"
                  className={`input-field pl-8 ${errors.symbol ? 'input-error' : ''}`}
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
              </div>
              {errors.symbol && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {errors.symbol.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                取引時には自動的に $SYMBOL の形式で表示されます
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              className={`input-field min-h-[120px] ${errors.description ? 'input-error' : ''}`}
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
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {errors.description.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              コインの目的や特徴について説明してください。この情報はZORAプラットフォームに表示されます。
            </p>
          </div>
        </div>
        
        {/* 送信ボタン */}
        <div className="form-actions bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          {error && (
            <div className="error-message mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-medium">エラーが発生しました</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <button
              type="submit"
              className="btn-primary py-3 px-6 rounded-lg font-medium flex-grow md:flex-grow-0 md:min-w-[200px] flex items-center justify-center"
              disabled={isLoading || !isConnected || step === 'processing'}
            >
              {isLoading || step === 'processing' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  処理中...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  作成してコインを発行
                </>
              )}
            </button>
            
            <div className="flex-grow bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              <p className="font-medium flex items-center mb-2">
                <svg className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                コイン発行について
              </p>
              <p>コインを発行すると、ZORAのCoins Protocolを通じてトークン化され、すぐに取引可能になります。<br />取引手数料の一部はクリエイターに還元されます。</p>
            </div>
          </div>
          
          {!isConnected && (
            <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
              コインを発行するにはウォレットを接続してください
            </p>
          )}
        </div>
      </form>
    </div>
  );
}