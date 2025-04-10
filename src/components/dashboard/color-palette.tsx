'use client';

import { useState } from 'react';

interface ColorPaletteDisplayProps {
  name: string;
  colors: string[];
}

export function ColorPaletteDisplay({ name, colors }: ColorPaletteDisplayProps) {
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  
  // クリップボードにコピー
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopied(color);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  
  // コントラストの高いテキストカラーを算出
  const getContrastColor = (hexColor: string) => {
    // HEXからRGBへ変換
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // 明るさを算出 (YIQ方式)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // 明るさに応じてテキストカラーを返す
    return yiq >= 128 ? '#000000' : '#ffffff';
  };
  
  return (
    <div className="color-palette">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[0] }}></span>
        {name}
      </h3>
      
      <div className="palette-display h-20 rounded-xl overflow-hidden flex shadow-sm">
        {colors.map((color: string, index: number) => (
          <div
            key={`${color}-${index}`}
            className="flex-1 relative transition-transform duration-200 cursor-pointer"
            style={{ 
              backgroundColor: color,
              transform: activeColor === color ? 'scale(1.05)' : 'scale(1)',
              zIndex: activeColor === color ? 10 : 1,
            }}
            onMouseEnter={() => setActiveColor(color)}
            onMouseLeave={() => setActiveColor(null)}
            onClick={() => copyToClipboard(color)}
          >
            {activeColor === color && (
              <div 
                className="absolute inset-0 flex items-center justify-center transition-opacity"
                style={{ color: getContrastColor(color) }}
              >
                <div className="text-center">
                  <span className="text-sm font-mono">{color}</span>
                  <div className="mt-1 text-xs opacity-80">クリックでコピー</div>
                </div>
              </div>
            )}
            
            {copied === color && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 animate-pulse"
                style={{ color: '#ffffff' }}
              >
                <div className="text-center">
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-xs">コピーしました</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="color-codes mt-3 flex flex-wrap gap-2">
        {colors.map((color: string, index: number) => (
          <div
            key={`code-${color}-${index}`}
            className="color-code px-2 py-1 rounded text-xs cursor-pointer transition-all hover:scale-105"
            style={{
              backgroundColor: `${color}20`,
              color: color,
              border: `1px solid ${color}40`
            }}
            onClick={() => copyToClipboard(color)}
          >
            {color}
          </div>
        ))}
      </div>
    </div>
  );
}