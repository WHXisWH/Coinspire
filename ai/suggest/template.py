from typing import List, Dict, Any, Optional
import json
import random

def generate_templates(
    keywords: List[str], 
    themes: List[Dict[str, Any]], 
    styles: List[Dict[str, Any]],
    color_palettes: List[Dict[str, Any]],
    count: int = 5
) -> List[Dict[str, Any]]:
    """トレンド情報に基づいてテンプレートを生成する"""
    templates = []
    
    # スタイルとテーマを組み合わせる
    for i in range(min(count, len(themes) * len(styles))):
        theme_idx = i % len(themes)
        style_idx = (i // len(themes)) % len(styles)
        
        theme = themes[theme_idx]["name"]
        style = styles[style_idx]["name"]
        
        # ランダムにキーワードを選択
        selected_keywords = random.sample(keywords, min(3, len(keywords)))
        keyword_text = ", ".join([k["text"] for k in selected_keywords])
        
        # カラーパレットをランダムに選択
        palette = random.choice(color_palettes) if color_palettes else None
        palette_name = palette["name"] if palette else "デフォルト"
        
        # テンプレートID
        template_id = f"template-{i+1}"
        
        # テンプレート名
        template_name = f"{style}の{theme}"
        
        # 説明文
        description = f"{theme}をテーマにした{style}スタイルのデザイン。{keyword_text}の要素を含みます。"
        
        # 画像URL（実際の実装ではテンプレート画像のパス）
        image_url = f"/templates/{template_id}.jpg"
        
        # タグ
        tags = [theme, style] + [k["text"] for k in selected_keywords[:2]]
        
        # AIプロンプト（Stable Diffusionなどで使用）
        ai_prompt = f"{theme}, {style}, {keyword_text}, 高品質, 詳細"
        
        # テンプレートオブジェクト
        template = {
            "id": template_id,
            "name": template_name,
            "description": description,
            "imageUrl": image_url,
            "tags": tags,
            "colorPalette": palette["colors"] if palette else None,
            "aiPrompt": ai_prompt
        }
        
        templates.append(template)
    
    return templates

# テスト用
if __name__ == "__main__":
    # テストデータ
    test_keywords = [
        {"text": "NFT", "value": 30},
        {"text": "メタバース", "value": 25},
        {"text": "デジタルアート", "value": 20},
        {"text": "ブロックチェーン", "value": 15}
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
    
    test_palettes = [
        {"name": "ネオン", "colors": ["#FF00FF", "#00FFFF", "#FFFF00", "#FF00AA"]},
        {"name": "パステル", "colors": ["#FFD1DC", "#FFECF1", "#A2D2FF", "#EFD3FF"]}
    ]
    
    result = generate_templates(test_keywords, test_themes, test_styles, test_palettes, 3)
    print(json.dumps(result, ensure_ascii=False, indent=2))
