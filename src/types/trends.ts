// キーワード情報
export interface Keyword {
  text: string;
  value: number; // 重要度・頻度
}

// テーマ情報
export interface Theme {
  name: string;
  popularity: number; // 人気度 (0-1)
  description?: string;
}

// カラーパレット
export interface ColorPalette {
  name: string;
  colors: string[]; // HEXカラーコード配列
  description?: string;
}

// ビジュアルスタイル
export interface VisualStyle {
  name: string;
  description?: string;
  examples: string[]; // 例示用画像URL
}

// テンプレート情報
export interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
  style?: VisualStyle;
  colorPalette?: ColorPalette;
  aiPrompt?: string; // 画像生成AIのプロンプト
}

// トレンド分析結果
export interface TrendAnalysis {
  keywords: Keyword[];
  themes: Theme[];
  colorPalettes: ColorPalette[];
  visualStyles: VisualStyle[];
  templates?: Template[];
  updatedAt?: string; // 最終更新日時
}
