from typing import List, Dict, Any, Optional
import json

# 事前定義されたテンプレート
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
        "tags": ["抽象", "パターン", "カラフル"],
        "aiPrompt": "抽象的なデジタルアート、キーワード、幾何学模様、波状のパターン"
    },
    {
        "id": "template-anime-1",
        "name": "アニメ風 イラスト",
        "description": "日本のアニメスタイルを取り入れたカラフルなイラスト",
        "imageUrl": "/images/templates/anime-1.png",
        "tags": ["アニメ", "イラスト", "カラフル"],
        "aiPrompt": "アニメスタイルのイラスト、キーワード、鮮やかな色彩、2Dスタイル"
    },
    {
        "id": "template-minimal-1",
        "name": "ミニマル デザイン",
        "description": "シンプルで洗練されたミニマルデザイン",
        "imageUrl": "/images/templates/minimal-1.png",
        "tags": ["ミニマル", "シンプル", "洗練"],
        "aiPrompt": "ミニマルなデザイン、キーワード、シンプル、余白、少ない色"
    },
    {
        "id": "template-retro-1",
        "name": "レトロ スタイル",
        "description": "80年代や90年代を思わせるレトロなデザイン",
        "imageUrl": "/images/templates/retro-1.png",
        "tags": ["レトロ", "ビンテージ", "ノスタルジック"],
        "aiPrompt": "レトロスタイル、キーワード、80年代、ビンテージ感、ノスタルジック"
    },
    {
        "id": "template-pixel-1",
        "name": "ピクセルアート スタイル",
        "description": "ドット絵風のピクセルアートスタイル",
        "imageUrl": "/images/templates/pixel-1.png",
        "tags": ["ピクセルアート", "レトロゲーム", "8ビット"],
        "aiPrompt": "ピクセルアート、キーワード、ドット絵、8ビットスタイル、レトロゲーム"
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
    """
    テンプレート一覧を返す。style によるフィルタリングと、キーワードの埋め込みが可能。
    """

    # style に一致するタグを持つテンプレートだけを対象にする
    if style:
        filtered = [t for t in PREDEFINED_TEMPLATES if style in t["tags"]]
        target_templates = filtered if filtered else PREDEFINED_TEMPLATES
    else:
        target_templates = PREDEFINED_TEMPLATES

    # キーワード挿入用テキスト
    selected_keywords_text = ", ".join([k["text"] for k in keywords[:3]]) if keywords else "トレンドキーワード"

    # aiPrompt の「キーワード」を実キーワードに置換
    final_templates = []
    for template in target_templates:
        new_template = template.copy()
        if "aiPrompt" in new_template and isinstance(new_template["aiPrompt"], str):
            new_template["aiPrompt"] = new_template["aiPrompt"].replace("キーワード", selected_keywords_text)
        final_templates.append(new_template)

    return final_templates[:min(count, len(final_templates))]


# --- テスト実行用コード ---
if __name__ == "__main__":
    test_keywords = [
        {"text": "NFT", "value": 30},
        {"text": "Web3", "value": 25},
        {"text": "ZORA", "value": 22}
    ]

    print("--- 'サイバーパンク' Filter Results ---")
    cyber = generate_templates(keywords=test_keywords, style="サイバーパンク", count=3)
    print(json.dumps(cyber, ensure_ascii=False, indent=2))

    print("\n--- No Style Filter Results ---")
    all_templates = generate_templates(keywords=test_keywords, count=5)
    print(json.dumps(all_templates, ensure_ascii=False, indent=2))

    print("\n--- Non-existent Style Filter Results ---")
    none = generate_templates(keywords=test_keywords, style="存在しないスタイル", count=3)
    print(json.dumps(none, ensure_ascii=False, indent=2))
