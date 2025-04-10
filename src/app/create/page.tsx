'use client';

import { useState } from 'react';
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
      <h1 className="text-3xl font-bold mb-6">創作とコイン発行</h1>
      
      {step === 'template' && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">トレンドに基づくテンプレート</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            今注目のトレンドからインスピレーションを得て、あなただけの作品を作りましょう。
          </p>
          
          {trendsLoading ? (
            <div className="flex justify-center">
              <span className="loading">ロード中...</span>
            </div>
          ) : (
            <TemplateGallery 
              trends={trends} 
              onSelect={handleTemplateSelect} 
            />
          )}
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setStep('create')}
              className="text-blue-500 underline"
            >
              テンプレートを使わずに作成する
            </button>
          </div>
        </div>
      )}
      
      {step === 'create' && (
        <CreationForm
          selectedTemplate={selectedTemplate}
          onContentUpload={handleContentUpload}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      )}
      
      {step === 'success' && result && (
        <div className="success-container p-6 rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
            成功！コインが作成されました
          </h2>
          
          <p className="mb-4">
            あなたのコインは正常に作成され、取引可能になりました。
          </p>
          
          {result.address && (
            <div className="mb-4">
              <p className="font-medium">コインアドレス:</p>
              <code className="block p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
                {result.address}
              </code>
            </div>
          )}
          
          <div className="flex gap-4 mt-6">
            <Link
              href={`https://zora.co/base/coins/${result.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Zoraで見る
            </Link>
            
            <button
              onClick={() => setStep('template')}
              className="btn-secondary px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              新しく作成する
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
