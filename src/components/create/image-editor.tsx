'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageEditorProps {
  imageUrl?: string;
  templateId?: string;
  onImageChange: (image: File) => void;
}

export function ImageEditor({ imageUrl, templateId, onImageChange }: ImageEditorProps) {
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [filters, setFilters] = useState({
    brightness: 100, // %
    contrast: 100,   // %
    saturation: 100, // %
    blur: 0,         // px
    hueRotate: 0,    // deg
  });
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // フィルター設定の文字列を作成
  const filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg)`;
  
  // テンプレートが変更された場合、画像をリセット
  useEffect(() => {
    if (templateId && imageUrl) {
      setPreview(imageUrl);
      resetFilters();
    }
  }, [templateId, imageUrl]);
  
  // 画像がロードされた時にキャンバスを初期化
  useEffect(() => {
    if (preview && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // document.createElementを使用してHTMLImageElementを作成
        const img = document.createElement('img');
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
        };
        img.src = preview;
      }
    }
  }, [preview]);
  
  // フィルターをリセット
  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hueRotate: 0
    });
  };
  
  // ファイル選択ハンドラ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // ファイルタイプチェック
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('JPG, PNG, GIF形式の画像ファイルを選択してください');
      return;
    }
    
    // プレビュー表示とイベント発火
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onImageChange(file);
    
    // フィルターリセット
    resetFilters();
  };
  
  // スライダーの変更ハンドラ
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, filter: keyof typeof filters) => {
    setFilters({
      ...filters,
      [filter]: parseInt(e.target.value)
    });
  };
  
  // キャンバス描画用のマウスハンドラ
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    
    // キャンバスの内容を画像として取得
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      if (blob) {
        // Fileオブジェクトを作成
        const file = new File([blob], 'edited-image.png', { type: 'image/png' });
        onImageChange(file);
      }
    }, 'image/png');
  };
  
  // 編集した画像を保存
  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // フィルターを適用した画像を取得
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // フィルターを適用したキャンバスから画像を生成
    canvas.toBlob((blob) => {
      if (blob) {
        // Fileオブジェクトを作成
        const file = new File([blob], 'edited-image.png', { type: 'image/png' });
        onImageChange(file);
        
        // プレビューを更新
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    }, 'image/png');
  };
  
  return (
    <div className="image-editor">
      {/* 画像選択部分 */}
      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          画像を選択
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
        />
      </div>
      
      {preview ? (
        <div className="editor-container space-y-6">
          {/* 画像プレビュー */}
          <div className="preview-container relative w-full h-64 md:h-80 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={preview}
                  alt="プレビュー"
                  fill
                  className="object-contain"
                  style={{ filter: filterString }}
                />
              </div>
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </div>
          
          {/* 編集コントロール */}
          <div className="edit-controls">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* フィルター設定 */}
              <div className="filters">
                <h3 className="font-medium mb-3">フィルター調整</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">明るさ</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.brightness}
                      onChange={(e) => handleFilterChange(e, 'brightness')}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">コントラスト</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.contrast}
                      onChange={(e) => handleFilterChange(e, 'contrast')}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">彩度</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.saturation}
                      onChange={(e) => handleFilterChange(e, 'saturation')}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">ぼかし</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={filters.blur}
                      onChange={(e) => handleFilterChange(e, 'blur')}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">色相回転</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={filters.hueRotate}
                      onChange={(e) => handleFilterChange(e, 'hueRotate')}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* 描画設定 */}
              <div className="draw-controls">
                <h3 className="font-medium mb-3">描画ツール</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">色</label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">ブラシサイズ</label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      リセット
                    </button>
                    <button
                      type="button"
                      onClick={saveImage}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <svg 
            className="w-16 h-16 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            画像が選択されていません
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            画像をアップロードするか、テンプレートを選択してください
          </p>
        </div>
      )}
    </div>
  );
}