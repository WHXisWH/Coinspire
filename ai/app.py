from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
import nltk
from analyze.text import analyze_text_trends
from analyze.image import analyze_image_trends
from suggest.template import generate_templates
from suggest.prompt import generate_prompts

app = Flask(__name__)

allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'https://coinspire.vercel.app')
origins = allowed_origins.split(',')
CORS(app, resources={r"/api/*": {"origins": origins}})

API_KEY = os.environ.get('AI_SERVICE_API_KEY')

try:
    nltk_data_path = os.path.join(os.environ.get('RENDER_PROJECT_ROOT', '.'), 'nltk_data')
    if not os.path.exists(nltk_data_path):
        os.makedirs(nltk_data_path)
    nltk.data.path.append(nltk_data_path)
    nltk.download('punkt', download_dir=nltk_data_path, quiet=True, raise_on_error=True)
    nltk.download('stopwords', download_dir=nltk_data_path, quiet=True, raise_on_error=True)
except Exception as e:
    print(f"NLTK data download error: {e}")


def require_api_key(f):
    def decorated_function(*args, **kwargs):
        if not API_KEY:
            return f(*args, **kwargs)

        request_key = request.headers.get('X-API-Key')
        if request_key and request_key == API_KEY:
            return f(*args, **kwargs)
        else:
            return jsonify({"error": "Invalid API key"}), 401

    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "AI service is running"})

@app.route('/api/trends', methods=['GET'])
@require_api_key
def get_trends():
    trends = {
        "keywords": [
            {"text": "NFT", "value": 30}, {"text": "Web3", "value": 25},
            {"text": "ZORA", "value": 22}, {"text": "仮想通貨", "value": 20},
            {"text": "ミーム", "value": 18}, {"text": "AI生成", "value": 15},
            {"text": "クリプトアート", "value": 12}, {"text": "メタバース", "value": 10},
            {"text": "ジェネラティブ", "value": 9}, {"text": "コレクション", "value": 8},
            {"text": "PFP", "value": 7}, {"text": "コミュニティ", "value": 6},
        ],
        "themes": [
            {"name": "サイバーパンク", "popularity": 0.8}, {"name": "レトロ風アート", "popularity": 0.75},
            {"name": "日本のアニメスタイル", "popularity": 0.7}, {"name": "ミニマリスト", "popularity": 0.65},
            {"name": "抽象的なデジタルアート", "popularity": 0.6},
        ],
        "colorPalettes": [
            {"name": "ネオン", "colors": ["#FF00FF", "#00FFFF", "#FFFF00", "#FF00AA"]},
            {"name": "パステル", "colors": ["#FFD1DC", "#FFECF1", "#A2D2FF", "#EFD3FF"]},
            {"name": "レトロ", "colors": ["#F4A460", "#4682B4", "#B22222", "#DAA520"]},
        ],
        "visualStyles": [
            {"name": "ピクセルアート", "examples": [""]}, {"name": "グリッチアート", "examples": [""]},
            {"name": "3Dレンダリング", "examples": [""]}, {"name": "手描き風", "examples": [""]},
            {"name": "平面デザイン", "examples": [""]},
        ],
        "updatedAt": "2025-03-31T12:00:00Z"
    }
    return jsonify(trends)

@app.route('/api/recommendation', methods=['GET'])
@require_api_key
def get_recommendation():
    try:
        keywords_str = request.args.get('keywords')
        style = request.args.get('style')
        count_str = request.args.get('count', '6')

        keywords_list = [{"text": k.strip(), "value": 0} for k in keywords_str.split(',')] if keywords_str else None
        try:
            count = int(count_str)
        except ValueError:
            count = 6

        recommended_templates = generate_templates(
            keywords=keywords_list,
            style=style,
            count=count
        )

        generated_prompts = generate_prompts(
            templates=recommended_templates,
            style=style,
            keywords=keywords_list
            ) if 'generate_prompts' in globals() else ["Prompt generation logic needed"]

        recommendations = {
            "templates": recommended_templates,
            "prompts": generated_prompts
        }
        return jsonify(recommendations), 200

    except Exception as e:
        app.logger.error(f"Error in /api/recommendation: {e}", exc_info=True)
        return jsonify({"error": "Failed to get recommendations", "details": str(e)}), 500


@app.route('/api/templates', methods=['GET'])
@require_api_key
def get_templates():
    keywords = [ {"text": "NFT", "value": 30}, {"text": "メタバース", "value": 25}, {"text": "デジタルアート", "value": 20}, {"text": "ブロックチェーン", "value": 15} ]
    themes = [ {"name": "サイバーパンク", "popularity": 0.8}, {"name": "ファンタジー", "popularity": 0.7}, {"name": "未来都市", "popularity": 0.6} ]
    styles = [ {"name": "ピクセルアート", "score": 0.9}, {"name": "3Dレンダリング", "score": 0.8}, {"name": "アニメ風", "score": 0.7} ]
    palettes = [ {"name": "ネオン", "colors": ["#FF00FF", "#00FFFF", "#FFFF00", "#FF00AA"]}, {"name": "パステル", "colors": ["#FFD1DC", "#FFECF1", "#A2D2FF", "#EFD3FF"]} ]
    templates = generate_templates(keywords, themes, styles, palettes, count=5)
    return jsonify(templates)

@app.route('/')
def index():
    return jsonify({"message": "Welcome to Coinspire API. Use /api/* endpoints."})

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 10000))
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
