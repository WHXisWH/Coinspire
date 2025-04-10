import React from 'react';
import { cn } from '@/utils/cn';

interface AlertProps {
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function Alert({
  title,
  message,
  variant = 'info',
  onClose,
  className,
  icon,
  action,
}: AlertProps) {
  // アラートのスタイル
  const baseStyles = 'p-4 rounded-lg border flex items-start';
  
  // バリアントに基づくスタイル
  const variantStyles = {
    info: 'bg-accent-50 border-accent-200 text-accent-700 dark:bg-accent-900/20 dark:border-accent-800 dark:text-accent-300',
    success: 'bg-success-50 border-success-200 text-success-700 dark:bg-success-900/20 dark:border-success-800 dark:text-success-300',
    warning: 'bg-warning-50 border-warning-200 text-warning-700 dark:bg-warning-900/20 dark:border-warning-800 dark:text-warning-300',
    error: 'bg-error-50 border-error-200 text-error-700 dark:bg-error-900/20 dark:border-error-800 dark:text-error-300',
  };
  
  // アイコンスタイル
  const iconStyles = 'flex-shrink-0 w-5 h-5 mr-3 mt-0.5';
  
  // デフォルトアイコン
  const defaultIcons = {
    info: (
      <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    success: (
      <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    warning: (
      <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    ),
    error: (
      <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
  };
  
  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {/* アイコン */}
      {icon || defaultIcons[variant]}
      
      {/* コンテンツ */}
      <div className="flex-1">
        {title && <h3 className="font-medium">{title}</h3>}
        <p className={title ? 'mt-1 text-sm' : undefined}>{message}</p>
        
        {/* アクション */}
        {action && <div className="mt-3">{action}</div>}
      </div>
      
      {/* 閉じるボタン */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-4 -mt-1 -mr-1 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  );
}