FROM python:3.9-slim

WORKDIR /app

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# NLTK のデータをダウンロード
RUN python -m nltk.downloader punkt stopwords

# ポート設定
EXPOSE 10000

# 環境変数設定
ENV PORT=10000
ENV PYTHONUNBUFFERED=1

# Gunicornでアプリケーションを起動
CMD gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 2 app:app