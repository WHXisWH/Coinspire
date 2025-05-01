from typing import List, Dict, Any, Optional
import json
import random

PREDEFINED_TEMPLATES = [
    {
        "id": "template-cyber-1",
        "name": "サイバーパンク デザイン",
        "description": "鮮やかな色彩とテクノロジー感あふれるデザイン",
        "imageUrl": "/images/templates/cyber-1.png",
        "tags": ["サイバーパンク", "未来的", "テック"],
        "aiPrompt": "サイバーパンクな世界、キーワード、ネオンの光、未来都市"
    },
    {
        "id": "template-abstract-1",
        "name": "抽象的 アート",
        "description": "幾何学的な形状と複雑なパターンを用いた抽象的なデザイン",
        "imageUrl": "/images/templates/abstract-1.png",
        "tags": ["抽象的なデジタルアート", "パターン", "カラフル"],
        "aiPrompt": "抽象的なデジタルアート、キーワード、幾何学模様、波状のパターン"
    },
    {
        "id": "template-anime-1",
        "name": "アニメ風 イラスト",
        "description": "日本のアニメスタイルを取り入れたカラフルなイラスト",
        "imageUrl": "/images/templates/anime-1.png",
        "tags": ["日本のアニメスタイル", "イラスト", "カラフル"],
        "aiPrompt": "アニメスタイルのイラスト、キーワード、鮮やかな色彩、2Dスタイル"
    },
    {
        "id": "template-minimal-1",
        "name": "ミニマル デザイン",
        "description": "シンプルで洗練されたミニマルデザイン",
        "imageUrl": "/images/templates/minimal-1.png",
        "tags": ["ミニマリスト", "シンプル", "洗練"],
        "aiPrompt": "ミニマルなデザイン、キーワード、シンプル、余白、少ない色"
    },
    {
        "id": "template-retro-1",
        "name": "レトロ スタイル",
        "description": "80年代や90年代を思わせるレトロなデザイン",
        "imageUrl": "/images/templates/retro-1.png",
        "tags": ["レトロ風アート", "ビンテージ", "ノスタルジック"],
        "aiPrompt": "レトロスタイル、キーワード、80年代、ビンテージ感、ノスタルジック"
    },
    {
        "id": "template-pixel-1",
        "name": "ピクセルアート スタイル",
        "description": "ドット絵風のピクセルアートスタイル",
        "imageUrl": "/images/templates/pixel-1.png",
        "tags": ["ピクセルアート", "レトロゲーム", "8ビット"],
        "aiPrompt": "ピクセルアート、キーワード、ドット絵、8ビットスタイル、レトロゲーム"
    },
    {
        "id": "template-glitch-1",
        "name": "グリッチアート スタイル",
        "description": "デジタルなノイズや歪みを表現したアート",
        "imageUrl": "/images/templates/glitch-1.png",
        "tags": ["グリッチアート", "デジタルノイズ", "抽象"],
        "aiPrompt": "グリッチアートスタイル、キーワード、データモッシュ、カラフルなノイズ"
    },
     {
        "id": "template-3d-1",
        "name": "3Dレンダリング スタイル",
        "description": "リアルまたは様式化された3Dレンダリング",
        "imageUrl": "/images/templates/3d-1.png",
        "tags": ["3Dレンダリング", "CG", "リアル"],
        "aiPrompt": "3Dレンダリング、キーワード、詳細な質感、フォトリアル"
    },
     {
        "id": "template-hand-1",
        "name": "手描き風 スタイル",
        "description": "温かみのある手描き風のイラストレーション",
        "imageUrl": "/images/templates/hand-1.png",
        "tags": ["手描き風", "イラスト", "スケッチ"],
        "aiPrompt": "手描き風イラスト、キーワード、インク、水彩、スケッチ"
    },
     {
        "id": "template-flat-1",
        "name": "平面デザイン スタイル",
        "description": "フラットでシンプルなグラフィックスタイル",
        "imageUrl": "/images/templates/flat-1.png",
        "tags": ["平面デザイン", "フラットデザイン", "シンプル"],
        "aiPrompt": "平面デザイン、キーワード、ベクターアート、シンプルな形状、フラットカラー"
    }
]

def generate_templates(
    keywords: Optional[List[Dict[str, Any]]] = None,
    themes: Optional[List[Dict[str, Any]]] = None,
    styles: Optional[List[Dict[str, Any]]] = None,
    color_palettes: Optional[List[Dict[str, Any]]] = None,
    style: Optional[str] = None,
    count: int = 6
) -> List[Dict[str, Any]]:

    if style:
        filtered = [t for t in PREDEFINED_TEMPLATES if style in t.get("tags", [])]
        target_templates = filtered
    else:
        target_templates = PREDEFINED_TEMPLATES

    selected_keywords_text = ", ".join([k["text"] for k in keywords[:3]]) if keywords else "トレンドキーワード"

    final_templates = []
    for template in target_templates:
        new_template = template.copy()
        if "aiPrompt" in new_template and isinstance(new_template["aiPrompt"], str):
            new_template["aiPrompt"] = new_template["aiPrompt"].replace("キーワード", selected_keywords_text)
        final_templates.append(new_template)

    return final_templates[:min(count, len(final_templates))]

if __name__ == "__main__":
    test_keywords = [
        {"text": "NFT", "value": 30},
        {"text": "Web3", "value": 25},
        {"text": "ZORA", "value": 22}
    ]

    print("--- 'サイバーパンク' Filter Results ---")
    cyber = generate_templates(keywords=test_keywords, style="サイバーパンク", count=3)
    print(json.dumps(cyber, ensure_ascii=False, indent=2))

    print("\n--- 'レトロ風アート' Filter Results ---")
    retro = generate_templates(keywords=test_keywords, style="レトロ風アート", count=3)
    print(json.dumps(retro, ensure_ascii=False, indent=2))

    print("\n--- No Style Filter Results ---")
    all_templates = generate_templates(keywords=test_keywords, count=5)
    print(json.dumps(all_templates, ensure_ascii=False, indent=2))

    print("\n--- Non-existent Style Filter Results ---")
    none = generate_templates(keywords=test_keywords, style="存在しないスタイル", count=3)
    print(json.dumps(none, ensure_ascii=False, indent=2))
