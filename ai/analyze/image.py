from typing import List, Dict, Any
import json
import random

# 実際の実装ではPillowやTensorFlow/PyTorchなどを使って画像分析を行う
# ここではモックデータを返すだけの簡易実装

def extract_colors(image_path: str) -> List[str]:
    """画像から主要な色を抽出する（モック）"""
    # 実際の実装ではPillowなどを使用して画像から色を抽出
    # ここではランダムな色を返す
    mock_colors = [
        "#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3",
        "#33FFF3", "#F333FF", "#FF3333", "#33FF33", "#3333FF"
    ]
    
    # ランダムに4-6色選択
    num_colors = random.randint(4, 6)
    return random.sample(mock_colors, num_colors)

def analyze_style(image_path: str) -> Dict[str, float]:
    """画像のスタイルを分析する（モック）"""
    # 実際の実装では事前学習済みモデルを使用して画像スタイルを判定
    styles = {
        "ピクセルアート": random.uniform(0, 1),
        "3Dレンダリング": random.uniform(0, 1),
        "写真": random.uniform(0, 1),
        "アニメ風": random.uniform(0, 1),
        "抽象的": random.uniform(0, 1),
        "ミニマリスト": random.uniform(0, 1)
    }
    
    # 確率の合計が1になるように正規化
    total = sum(styles.values())
    return {style: score/total for style, score in styles.items()}

def extract_themes(image_path: str) -> List[Dict[str, float]]:
    """画像からテーマを抽出する（モック）"""
    # 実際の実装では物体検出や画像分類モデルを使用
    themes = [
        {"name": "自然", "confidence": random.uniform(0, 1)},
        {"name": "都市", "confidence": random.uniform(0, 1)},
        {"name": "テクノロジー", "confidence": random.uniform(0, 1)},
        {"name": "ファンタジー", "confidence": random.uniform(0, 1)},
        {"name": "抽象", "confidence": random.uniform(0, 1)}
    ]
    
    # 確率でソート
    themes.sort(key=lambda x: x["confidence"], reverse=True)
    return themes[:3]  # 上位3つのみ返す

def analyze_image_trends(image_paths: List[str]) -> Dict[str, Any]:
    """複数の画像からトレンドを分析する"""
    all_colors = []
    style_scores = {}
    all_themes = []
    
    for image_path in image_paths:
        # 色抽出
        colors = extract_colors(image_path)
        all_colors.extend(colors)
        
        # スタイル分析
        styles = analyze_style(image_path)
        for style, score in styles.items():
            if style in style_scores:
                style_scores[style] += score
            else:
                style_scores[style] = score
        
        # テーマ抽出
        themes = extract_themes(image_path)
        all_themes.extend(themes)
    
    # 色の集計（重複を除去して頻度順）
    color_counter = {}
    for color in all_colors:
        color_counter[color] = color_counter.get(color, 0) + 1
    
    sorted_colors = sorted(color_counter.items(), key=lambda x: x[1], reverse=True)
    unique_colors = [color for color, _ in sorted_colors]
    
    # カラーパレットを作成
    color_palettes = []
    if len(unique_colors) >= 4:
        palette1 = {"name": "トレンドパレット1", "colors": unique_colors[:4]}
        color_palettes.append(palette1)
    
    if len(unique_colors) >= 8:
        palette2 = {"name": "トレンドパレット2", "colors": unique_colors[4:8]}
        color_palettes.append(palette2)
    
    # スタイルの集計
    total_images = len(image_paths)
    for style in style_scores:
        style_scores[style] /= total_images
    
    # 上位のスタイルを取得
    sorted_styles = sorted(style_scores.items(), key=lambda x: x[1], reverse=True)
    visual_styles = [{"name": style, "score": score} for style, score in sorted_styles[:5]]
    
    # テーマの集計
    theme_scores = {}
    for theme in all_themes:
        name = theme["name"]
        score = theme["confidence"]
        if name in theme_scores:
            theme_scores[name] += score
        else:
            theme_scores[name] = score
    
    # テーマを正規化して上位を取得
    for theme in theme_scores:
        theme_scores[theme] /= len(all_themes)
    
    sorted_themes = sorted(theme_scores.items(), key=lambda x: x[1], reverse=True)
    themes = [{"name": name, "popularity": score} for name, score in sorted_themes[:5]]
    
    return {
        "colorPalettes": color_palettes,
        "visualStyles": visual_styles,
        "themes": themes
    }

# テスト用
if __name__ == "__main__":
    # 実際のパスを使用する代わりにダミーパスのリスト
    test_image_paths = ["image1.jpg", "image2.jpg", "image3.jpg"]
    
    result = analyze_image_trends(test_image_paths)
    print(json.dumps(result, ensure_ascii=False, indent=2))
