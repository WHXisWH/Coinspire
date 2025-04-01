from typing import List, Dict, Any, Optional
import json
import random

def generate_prompts(
    keywords: List[Dict[str, Any]], 
    themes: List[Dict[str, Any]], 
    styles: List[Dict[str, Any]],
    count: int = 5
) -> List[str]:
    """トレンド情報に基づいてAIアート生成用のプロンプトを生成する"""
    prompts = []
    
    # キーワードから重要なものを抽出
    top_keywords = keywords[:min(5, len(keywords))]
    keyword_texts = [k["text"] for k in top_keywords]
    
    # テーマから重要なものを抽出
    top_themes = themes[:min(3, len(themes))]
    theme_names = [t["name"] for t in top_themes]
    
    # スタイルから重要なものを抽出
    top_styles = styles[:min(3, len(styles))]
    style_names = [s["name"] for s in top_styles]
    
    # 基本的な修飾語句
    modifiers = [
        "高品質", "詳細", "美しい", "魅力的", "印象的",
        "創造的", "独創的", "芸術的", "洗練された", "鮮やか"
    ]
    
    # 構図・視点
    compositions = [
        "正面図", "俯瞰", "クローズアップ", "パノラマ", "ワイドアングル",
        "シンメトリー", "非対称", "ミニマル", "複雑な構図", "中央にフォーカス"
    ]
    
    # ライティング
    lighting = [
        "自然光", "夕暮れ", "夜景", "ネオンライト", "バックライト",
        "ドラマチックなライティング", "柔らかい光", "コントラストの強い", "カラフルな照明"
    ]
    
    # プロンプト生成
    for i in range(count):
        # ランダムに要素を選択
        theme = random.choice(theme_names) if theme_names else ""
        style = random.choice(style_names) if style_names else ""
        
        # キーワードをシャッフルして選択
        random.shuffle(keyword_texts)
        selected_keywords = keyword_texts[:min(3, len(keyword_texts))]
        
        # 修飾語をランダムに選択
        selected_modifiers = random.sample(modifiers, min(2, len(modifiers)))
        selected_composition = random.choice(compositions)
        selected_lighting = random.choice(lighting)
        
        # プロンプト構築
        prompt_parts = []
        
        if theme:
            prompt_parts.append(theme)
        
        if style:
            prompt_parts.append(f"{style}スタイル")
        
        prompt_parts.extend(selected_keywords)
        prompt_parts.append(selected_composition)
        prompt_parts.append(selected_lighting)
        prompt_parts.extend(selected_modifiers)
        
        # プロンプトを結合
        prompt = "、".join(prompt_parts)
        
        prompts.append(prompt)
    
    return prompts

# テスト用
if __name__ == "__main__":
    # テストデータ
    test_keywords = [
        {"text": "NFT", "value": 30},
        {"text": "メタバース", "value": 25},
        {"text": "デジタルアート", "value": 20},
        {"text": "ブロックチェーン", "value": 15},
        {"text": "仮想世界", "value": 10}
    ]
    
    test_themes = [
        {"name": "サイバーパンク", "popularity": 0.8},
        {"name": "ファンタジー", "popularity": 0.7},
        {"name": "未来都市", "popularity": 0.6}
    ]
    
    test_styles = [
        {"name": "ピクセルアート", "score": 0.9},
        {"name": "3Dレンダリング", "score": 0.8},
        {"name": "アニメ風", "score": 0.7}
    ]
    
    result = generate_prompts(test_keywords, test_themes, test_styles, 3)
    print(json.dumps(result, ensure_ascii=False, indent=2))
