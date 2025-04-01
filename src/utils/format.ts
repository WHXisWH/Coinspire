/**
 * 数値を指定桁数まで丸める
 * @param value 丸める数値
 * @param decimals 小数点以下の桁数
 * @returns 丸められた数値
 */
export function roundToDecimals(value: number | string, decimals: number = 2): number {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const factor = Math.pow(10, decimals);
  return Math.round(numValue * factor) / factor;
}

/**
 * 通貨形式にフォーマット
 * @param value フォーマットする値
 * @param options フォーマットオプション
 * @returns フォーマットされた通貨文字列
 */
export function formatCurrency(
  value: number | string, 
  options: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return numValue.toLocaleString(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

/**
 * ウォレットアドレスを省略表示
 * @param address ウォレットアドレス
 * @param prefixLength 先頭の文字数
 * @param suffixLength 末尾の文字数
 * @returns 省略されたアドレス
 */
export function formatAddress(
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  
  return `${address.substring(0, prefixLength)}...${address.substring(
    address.length - suffixLength
  )}`;
}

/**
 * 日付を相対時間表示に変換
 * @param dateString 日付文字列またはDate
 * @returns 相対時間（例: "3時間前", "2日前"）
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // 秒 -> 分 -> 時間 -> 日 -> 週 -> 月 -> 年
  const intervals = [
    { unit: '年', seconds: 31536000 },
    { unit: 'ヶ月', seconds: 2592000 },
    { unit: '週間', seconds: 604800 },
    { unit: '日', seconds: 86400 },
    { unit: '時間', seconds: 3600 },
    { unit: '分', seconds: 60 },
    { unit: '秒', seconds: 1 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.unit}前`;
    }
  }
  
  return 'たった今';
}
