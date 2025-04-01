import { z } from 'zod';

/**
 * Zod schema for coin creation
 */
export const coinCreationSchema = z.object({
  title: z.string()
    .min(1, { message: 'コイン名は必須です' })
    .max(50, { message: 'コイン名は50文字以内で入力してください' }),
    
  symbol: z.string()
    .min(1, { message: 'シンボルは必須です' })
    .max(10, { message: 'シンボルは10文字以内で入力してください' })
    .regex(/^[A-Za-z0-9]+$/, { 
      message: 'シンボルはアルファベットと数字のみ使用できます' 
    }),
    
  description: z.string()
    .min(1, { message: '説明は必須です' })
    .max(500, { message: '説明は500文字以内で入力してください' }),
});

export type CoinCreationFormData = z.infer<typeof coinCreationSchema>;

/**
 * ファイルのバリデーション
 * @param file 検証するファイル
 * @param options バリデーションオプション
 * @returns エラーメッセージまたはnull
 */
export const validateFile = (
  file: File,
  options: {
    allowedTypes?: string[];
    maxSizeMB?: number;
  } = {}
): string | null => {
  const { 
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    maxSizeMB = 5 
  } = options;
  
  // ファイルタイプの検証
  if (!allowedTypes.includes(file.type)) {
    return `サポートされていないファイル形式です。${allowedTypes.join(', ')} のいずれかを選択してください`;
  }
  
  // ファイルサイズの検証 (バイト単位から変換)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `ファイルサイズは${maxSizeMB}MB以下にしてください`;
  }
  
  return null;
};
