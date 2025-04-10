'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { CreationForm } from '@/components/create/creation-form';
import { TemplateGallery } from '@/components/create/template-gallery';
import { useZoraMint } from '@/hooks/useZora';
import { useTrends } from '@/hooks/useTrends';

export default function CreatePage() {
  const { address } = useAccount();
  const { mint, isLoading, error, result } = useZoraMint();
  const { trends, isLoading: trendsLoading } = useTrends();
  
  const [step, setStep] = useState<'template' | 'create' | 'confirm' | 'success'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState<any | null>(null);
  const [content, setContent] = useState<File | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  
  // アニメーション効果の管理
  useEffect(() => {
    setAnimateIn(true);
    const timeout = setTimeout(() => setAnimateIn(false), 500);
    return () => clearTimeout(timeout);
  }, [step]);
  
  const handleTemplateSelect = (templateId: string, template: any) => {
    setSelectedTemplate(templateId);
    setTemplateData(template);
    setStep('create');
  };
  
  const handleContentUpload = (file: File) => {
    setContent(file);
  };
  
  const handleSubmit = async (data: {
    title: string;
    symbol: string;
    description: string;
  }) => {
    if (!address || !content) return;
    
    const mintResult = await mint(
      content,
      data.title,
      data.symbol,
      data.description,
      address
    );
    
    if (mintResult?.success) {
      setStep('success');
    }
  };
  
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-3">クリエイティブコンテンツの作成と発行</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            分析されたトレンドからインスピレーションを得て、あなただけのコインを発行しましょう。
          </p>
        </div>
        
        {/* 進行状況インジケーター */}
        <div className="mb-10">
          <div className="flex items-center">
            <div className={`step-indicator flex flex-col items-center ${step === 'template' ? 'active' : (step === 'create' || step === 'success' ? 'completed' : '')}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg border-2 ${
                step === 'template' 
                  ? 'border-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                  : (step === 'create' || step === 'success' 
                    ? 'border-green-600 bg-green-600 text-white' 
                    : 'border-gray-300 text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600')
              }`}>
                {step === 'create' || step === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : "1"}
              </div>
              <span className={`mt-2 text-sm font-medium ${
                step === 'template' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
              }`}>テンプレート選択</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${
              step === 'create' || step === 'success' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
            }`}></div>
            
            <div className={`step-indicator flex flex-col items-center ${step === 'create' ? 'active' : (step === 'success' ? 'completed' : '')}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg border-2 ${
                step === 'create' 
                  ? 'border-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                  : (step === 'success' 
                    ? 'border-green-600 bg-green-600 text-white' 
                    : 'border-gray-300 text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600')
              }`}>
                {step === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : "2"}
              </div>
              <span className={`mt-2 text-sm font-medium ${
                step === 'create' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
              }`}>コンテンツ作成</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${
              step === 'success' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
            }`}></div>
            
            <div className={`step-indicator flex flex-col items-center ${step === 'success' ? 'active' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg border-2 ${
                step === 'success' 
                  ? 'border-green-600 bg-green-50 text-green-600 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400' 
                  : 'border-gray-300 text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600'
              }`}>
                3
              </div>
              <span className={`mt-2 text-sm font-medium ${
                step === 'success' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
              }`}>完了</span>
            </div>
          </div>
        </div>
        
        {/* テンプレート選択ステップ */}
        {step === 'template' && (
          <div className={`template-section ${animateIn ? 'fade-in' : ''}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                トレンドに基づくテンプレート
              </h2>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6 border border-primary-100 dark:border-primary-800">
                <p className="text-primary-800 dark:text-primary-300 flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>AIが分析した最新トレンドに基づいて、人気のあるテンプレートが表示されています。気に入ったデザインを選択して、カスタマイズしましょう。</span>
                </p>
              </div>
              
              {trendsLoading ? (
                <div className="loading-state flex justify-center items-center p-12">
                  <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <TemplateGallery 
                  trends={trends} 
                  onSelect={handleTemplateSelect} 
                />
              )}
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setStep('create')}
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center justify-center mx-auto"
                >
                  <span>テンプレートを使わずに作成する</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* コンテンツ作成ステップ */}
        {step === 'create' && (
          <div className={`creation-section ${animateIn ? 'fade-in' : ''}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  コンテンツ作成とコイン発行
                </h2>
                <button 
                  onClick={() => setStep('template')}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  テンプレート選択に戻る
                </button>
              </div>
              
              {selectedTemplate && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">選択されたテンプレート: {templateData?.name || selectedTemplate}</h3>
                    <button
                      onClick={() => {
                        setSelectedTemplate(null);
                        setTemplateData(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                    >
                      変更
                    </button>
                  </div>
                  {templateData?.aiPrompt && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">AIプロンプト:</span> {templateData.aiPrompt}
                    </div>
                  )}
                </div>
              )}
              
              <CreationForm
                selectedTemplate={selectedTemplate}
                templateData={templateData}
                onContentUpload={handleContentUpload}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        )}
        
        {/* 成功ステップ */}
        {step === 'success' && result && (
          <div className={`success-section ${animateIn ? 'fade-in' : ''}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-8 border border-green-200 dark:border-green-800">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
                  成功！コインが作成されました
                </h2>
                
                <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                  あなたのコインは正常に作成され、取引可能になりました。<br />
                  ZORAプラットフォームでコインを確認し、取引を開始しましょう。
                </p>
              </div>
              
              {result.address && (
  <>
    <code className="block p-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto flex-1 font-mono text-sm">
      {result.address}
    </code>
    <button
      onClick={() => {
        if (result.address) {
          navigator.clipboard.writeText(result.address);
        }
      }}
      className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      title="アドレスをコピー"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        ></path>
      </svg>
    </button>
  </>
)}

              
{result.hash && (
  <>
    <code className="block p-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto flex-1 font-mono text-sm">
      {result.hash}
    </code>
    <button
      onClick={() => {
        if (result.hash) {
          navigator.clipboard.writeText(result.hash);
        }
      }}
      className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      title="ハッシュをコピー"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        ></path>
      </svg>
    </button>
  </>
)}

              
              <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                {result.address && (
                  <a
                    href={`https://zora.co/base/coins/${result.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-6 py-3 rounded-lg font-medium text-center flex items-center justify-center"
                  >
                    <span>Zoraで見る</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                )}
                
                <button
                  onClick={() => {
                    setStep('template');
                    setSelectedTemplate(null);
                    setTemplateData(null);
                    setContent(null);
                  }}
                  className="btn-secondary px-6 py-3 rounded-lg font-medium text-center flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span>新しく作成する</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}