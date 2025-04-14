from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from analyze.text import analyze_text_trends
from analyze.image import analyze_image_trends
from suggest.template import generate_templates
from suggest.prompt import generate_prompts

app = Flask(__name__)
CORS(app)  # クロスオリジンリクエストを許可

# 環境変数からAPIキーを取得
API_KEY = os.environ.get('AI_SERVICE_API_KEY')

# APIキー認証ミドルウェア
def require_api_key(f):
    def decorated_function(*args, **kwargs):
        # APIキーが設定されていない場合は認証をスキップ（開発環境用）
        if not API_KEY:
            return f(*args, **kwargs)
            
        # リクエストからAPIキーを取得して検証
        request_key = request.headers.get('X-API-Key')
        if request_key and request_key == API_KEY:
            return f(*args, **kwargs)
        else:
            return jsonify({"error": "Invalid API key"}), 401
            
    decorated_function.__name__ = f.__name__
    return decorated_function

# トレンド分析エンドポイント
@app.route('/api/trends', methods=['GET'])
@require_api_key
def get_trends():
    # 実際の実装では、外部データソースからのデータ取得や
    # 機械学習モデルを使用した分析を行うべきですが、
    # ここではモックデータを返します
    
    # モックデータ（実際はDBや分析エンジンから取得）
    trends = {
        "keywords": [
            {"text": "NFT", "value": 30},
            {"text": "Web3", "value": 25},
            {"text": "ZORA", "value": 22},
            {"text": "仮想通貨", "value": 20},
            {"text": "ミーム", "value": 18},
            {"text": "AI生成", "value": 15},
            {"text": "クリプトアート", "value": 12},
            {"text": "メタバース", "value": 10},
            {"text": "ジェネラティブ", "value": 9},
            {"text": "コレクション", "value": 8},
            {"text": "PFP", "value": 7},
            {"text": "コミュニティ", "value": 6},
        ],
        "themes": [
            {"name": "サイバーパンク", "popularity": 0.8},
            {"name": "レトロ風アート", "popularity": 0.75},
            {"name": "日本のアニメスタイル", "popularity": 0.7},
            {"name": "ミニマリスト", "popularity": 0.65},
            {"name": "抽象的なデジタルアート", "popularity": 0.6},
        ],
        "colorPalettes": [
            {"name": "ネオン", "colors": ["#FF00FF", "#00FFFF", "#FFFF00", "#FF00AA"]},
            {"name": "パステル", "colors": ["#FFD1DC", "#FFECF1", "#A2D2FF", "#EFD3FF"]},
            {"name": "レトロ", "colors": ["#F4A460", "#4682B4", "#B22222", "#DAA520"]},
        ],
        "visualStyles": [
            {"name": "ピクセルアート", "examples": ["https://example.com/pixel1.jpg"]},
            {"name": "グリッチアート", "examples": ["https://example.com/glitch1.jpg"]},
            {"name": "3Dレンダリング", "examples": ["https://example.com/3d1.jpg"]},
            {"name": "手描き風", "examples": ["https://example.com/hand1.jpg"]},
            {"name": "平面デザイン", "examples": ["https://example.com/flat1.jpg"]},
        ],
        "updatedAt": "2025-03-31T12:00:00Z"
    }
    
    return jsonify(trends)

# レコメンデーションエンドポイント
@app.route('/api/recommendation', methods=['GET'])
@require_api_key
def get_recommendation():
    # クエリパラメータから条件を取得
    keywords = request.args.get('keywords', '').split(',') if request.args.get('keywords') else []
    style = request.args.get('style')
    
    # キーワードと選択されたスタイルに基づいて、
    # テンプレートやプロンプト案を生成
    # 実際の実装では機械学習モデルやルールベースの推論を使用
    
    # シンプルなモックレスポンス
    recommendations = {
        "templates": [
            {
                "id": "template-cyber-1",
                "name": f"{style or '未来的'} デザイン",
                "description": "鮮やかな色彩とテック感あふれるデザイン",
                "imageUrl": "/templates/cyber-1.png",
                "tags": ["サイバー", "未来的", "テック"],
                "aiPrompt": f"サイバーパンクな世界、{', '.join(keywords[:3]) if keywords else 'ネオンの光、未来都市'}"
            },
            {
                "id": "template-abstract-1",
                "name": f"{style or '抽象的'} アート",
                "description": "幾何学的な形状と複雑なパターンを用いた抽象的なデザイン",
                "imageUrl": "/templates/abstract-1.png",
                "tags": ["抽象", "パターン", "カラフル"],
                "aiPrompt": f"抽象的なデジタルアート、{', '.join(keywords[:3]) if keywords else '幾何学模様、波状のパターン'}"
            }
        ],
        "prompts": [
            f"サイバーパンクな都市風景、ネオンの光、{', '.join(keywords[:3]) if keywords else '高層ビル、未来的'}",
            f"抽象的な{style or 'デジタル'}アート、鮮やかな色彩、{', '.join(keywords[:3]) if keywords else '流動的なフォルム'}"
        ]
    }
    
    return jsonify(recommendations)
    
@app.route('/')
def index():
    return jsonify({"message": "Welcome to Coinspire API. Use /api/* endpoints."})
    
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 10000))  # デフォルト10000でもOK
    app.run(debug=True, host='0.0.0.0', port=port)
