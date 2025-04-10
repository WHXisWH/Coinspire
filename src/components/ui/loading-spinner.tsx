import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'success' | 'error';
  text?: string;
  className?: string;
  textClassName?: string;
  showText?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text = 'ロード中...',
  className,
  textClassName,
  showText = true,
}: LoadingSpinnerProps) {
  // サイズに基づくスタイル
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };
  
  // カラーに基づくスタイル
  const colorClasses = {
    primary: 'border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-400',
    white: 'border-gray-200/20 border-t-white',
    gray: 'border-gray-200 dark:border-gray-700 border-t-gray-500 dark:border-t-gray-400',
    success: 'border-gray-200 dark:border-gray-700 border-t-green-600 dark:border-t-green-400',
    error: 'border-gray-200 dark:border-gray-700 border-t-red-600 dark:border-t-red-400',
  };
  
  // テキストカラーに基づくスタイル
  const textColorClasses = {
    primary: 'text-primary-600 dark:text-primary-400',
    white: 'text-white',
    gray: 'text-gray-500 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
  };
  
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div 
        className={cn(
          'rounded-full animate-spin', 
          sizeClasses[size], 
          colorClasses[color]
        )}
      />
      {showText && (
        <p className={cn('mt-2 text-sm', textColorClasses[color], textClassName)}>
          {text}
        </p>
      )}
    </div>
  );
}