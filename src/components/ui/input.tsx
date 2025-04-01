'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
            error 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p 
            className={cn(
              "mt-1 text-sm", 
              error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
