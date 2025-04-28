'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getIpfsGateways } from '@/lib/ipfs';

interface IpfsImageProps extends Omit<ImageProps, 'src'> {
  ipfsUrl: string;
  fallbackSrc?: string;
}

export function IpfsImage({ 
  ipfsUrl, 
  fallbackSrc = '/images/placeholder.png',
  alt, 
  ...props 
}: IpfsImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [gatewayIndex, setGatewayIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const gateways = getIpfsGateways();
  
  useEffect(() => {
    if (!ipfsUrl) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(false);
      return;
    }
    
    if (ipfsUrl.startsWith('ipfs://')) {
      const cid = ipfsUrl.replace('ipfs://', '');
      setCurrentSrc(`${gateways[gatewayIndex]}${cid}`);
    } else {
      setCurrentSrc(ipfsUrl);
    }
    
    setIsLoading(true);
    setIsError(false);
  }, [ipfsUrl, gatewayIndex, fallbackSrc]);
  
  const handleError = () => {
    if (gatewayIndex < gateways.length - 1) {
      // 次のゲートウェイを試す
      setGatewayIndex(gatewayIndex + 1);
    } else {
      // すべてのゲートウェイが失敗したらフォールバック画像を使用
      setCurrentSrc(fallbackSrc);
      setIsError(true);
      setIsLoading(false);
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      )}
      
      <Image
        src={currentSrc}
        alt={alt || 'IPFS Image'}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}