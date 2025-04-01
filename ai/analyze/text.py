import nltk
import re
from collections import Counter
import json
from typing import List, Dict, Any

# NLTKのリソースをダウンロード（初回のみ）
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# 日本語のストップワード（必要に応じて拡張）
JAPANESE_STOP_WORDS = set([
    'の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し', 'れ',
    'さ', 'ある', 'いる', 'も', 'する', 'から', 'な', 'こと', 'として',
    'い', 'や', 'れる', 'など', 'なっ', 'ない', 'この', 'ため', 'その',
    'あっ', 'よう', 'また', 'もの', 'という', 'あり', 'まで', 'られ',
    'なる', 'へ', 'か', 'だ', 'これ', 'によって', 'により', 'おり',
    'より', 'による', 'ず', 'なり', 'られる', 'において', 'ば', 'なかっ',
    'なく', 'しかし', 'について', 'せ', 'だっ', 'その後', 'できる',
    'それ', 'う', 'ので', 'なお', 'のみ', 'でき', 'き', 'つ', 'における',
    'および', 'いう', 'さらに', 'でも', 'ら', 'たり', 'その他', 'に関する',
    'ほか', 'ものの', 'すべて', 'ただし', 'および', 'を通じて', 'のような',
    'すでに', 'たち', 'ここ', 'そして', 'とともに', 'ただ', 'なぜなら',
    'せる', 'けれども', 'ほとんど', 'だけ', 'しばしば', 'そのため',
])

def clean_text(text: str) -> str:
    """テキストをクリーニングする"""
    # 小文字に変換
    text = text.lower()
    # URLを削除
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    # ハッシュタグを削除
    text = re.sub(r'#\S+', '', text)
    # メンションを削除
    text = re.sub(r'@\S+', '', text)
    # 特殊文字を削除
    text = re.sub(r'[^\w\s\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]', '', text)
    # 余分な空白を削除
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def tokenize_text(text: str, is_japanese: bool = False) -> List[str]:
    """テキストをトークン化する"""
    if is_japanese:
        # 簡易的な日本語のトークン化（実際はMeCabやJanomeなどの形態素解析器を使用するべき）
        # ここでは単純に文字単位で区切る
        tokens = list(text)
        # 1文字のトークンを除外
        tokens = [token for token in tokens if len(token) > 1]
    else:
        # 英語のトークン化
        tokens = nltk.word_tokenize(text)
    return tokens

def filter_tokens(tokens: List[str], stopwords: set, min_length: int = 2) -> List[str]:
    """ストップワードとノイズを除去する"""
    return [token for token in tokens if token not in stopwords and len(token) >= min_length]

def extract_keywords(texts: List[str], top_n: int = 20, is_japanese: bool = False) -> List[Dict[str, Any]]:
    """複数のテキストからキーワードを抽出する"""
    all_tokens = []
    
    for text in texts:
        cleaned_text = clean_text(text)
        tokens = tokenize_text(cleaned_text, is_japanese)
        
        # 言語に応じたストップワードを使用
        if is_japanese:
            filtered = filter_tokens(tokens, JAPANESE_STOP_WORDS)
        else:
            filtered = filter_tokens(tokens, set(nltk.corpus.stopwords.words('english')))
            
        all_tokens.extend(filtered)
    
    # 頻度カウント
    counter = Counter(all_tokens)
    
    # 上位N個のキーワードを取得
    top_keywords = counter.most_common(top_n)
    
    # 結果をフォーマット
    result = [{"text": keyword, "value": count} for keyword, count in top_keywords]
    
    return result

def analyze_text_trends(data_sources: List[Dict[str, Any]]) -> Dict[str, Any]:
    """複数のデータソースからトレンドを分析する"""
    # 各データソースからテキストを抽出
    all_texts = []
    japanese_texts = []
    english_texts = []
    
    for source in data_sources:
        text = source.get('text', '')
        language = source.get('language', 'auto')
        
        # 言語判定（簡易的）
        if language == 'auto':
            # 日本語文字が含まれているかで判定
            is_japanese = bool(re.search(r'[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]', text))
        else:
            is_japanese = language == 'ja'
        
        if is_japanese:
            japanese_texts.append(text)
        else:
            english_texts.append(text)
        
        all_texts.append(text)
    
    # キーワード抽出
    all_keywords = extract_keywords(all_texts)
    japanese_keywords = extract_keywords(japanese_texts, is_japanese=True) if japanese_texts else []
    english_keywords = extract_keywords(english_texts) if english_texts else []
    
    # 結果を統合
    combined_keywords = all_keywords
    
    # 簡易的なテーマ抽出（実際はもっと高度なトピックモデリングが必要）
    themes = [
        {"name": "NFTアート", "popularity": 0.85},
        {"name": "クリプトコミュニティ", "popularity": 0.75},
        {"name": "メタバース", "popularity": 0.7},
        {"name": "ブロックチェーンゲーム", "popularity": 0.65}
    ]
    
    return {
        "keywords": combined_keywords,
        "themes": themes
    }

# テスト用
if __name__ == "__main__":
    test_data = [
        {"text": "NFTアートがクリプト市場で人気急上昇中。デジタルアーティストたちに新たな収益の道が開かれています。", "language": "ja"},
        {"text": "The metaverse is expanding with new NFT collections and virtual real estate sales.", "language": "en"},
        {"text": "ZORAでのNFTミント数が先週比で30%増加。クリエイターエコノミーが活性化の兆し。", "language": "ja"}
    ]
    
    result = analyze_text_trends(test_data)
    print(json.dumps(result, ensure_ascii=False, indent=2))
