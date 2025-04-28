// 一般的なエラーメッセージ
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return '予期しないエラーが発生しました';
  }
  
  // ウォレット関連のエラーメッセージ
  export function getWalletErrorMessage(error: unknown): string {
    const message = getErrorMessage(error);
    
    // よくあるウォレットエラーをユーザーフレンドリーなメッセージに変換
    if (message.includes('user rejected')) {
      return 'ウォレットでトランザクションが拒否されました';
    }
    
    if (message.includes('insufficient funds')) {
      return 'ウォレットの残高が不足しています';
    }
    
    if (message.includes('execution reverted')) {
      return 'トランザクションの実行が元に戻されました。入力パラメータを確認してください';
    }
    
    if (message.includes('nonce')) {
      return 'トランザクションのノンスが無効です。ウォレットを更新してみてください';
    }
    
    if (message.includes('gas')) {
      return 'ガス設定に問題があります。後でもう一度お試しください';
    }
    
    return `トランザクションエラー: ${message}`;
  }
  
  // ネットワーク関連のエラーメッセージ
  export function getNetworkErrorMessage(error: unknown): string {
    const message = getErrorMessage(error);
    
    if (message.includes('network') || message.includes('connection')) {
      return 'ネットワーク接続に問題があります。インターネット接続を確認してください';
    }
    
    if (message.includes('timeout')) {
      return 'リクエストがタイムアウトしました。後でもう一度お試しください';
    }
    
    return `ネットワークエラー: ${message}`;
  }
  
  // IPFS関連のエラーメッセージ
  export function getIpfsErrorMessage(error: unknown): string {
    const message = getErrorMessage(error);
    
    if (message.includes('upload')) {
      return 'ファイルのアップロードに失敗しました。後でもう一度お試しください';
    }
    
    return `IPFSエラー: ${message}`;
  }