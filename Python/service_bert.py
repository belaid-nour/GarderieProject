from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from keybert import KeyBERT
from unidecode import unidecode
import torch
import logging
import re
import unicodedata

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration améliorée
NEGATIVE_KEYWORDS = {
    'mechant', 'agite', 'irrespectueux', 'colerique', 'desobeissant',
    'violent', 'impoli', 'insolent', 'perturbateur', 'agressif', 'insultant'
}

POSITIVE_KEYWORDS = {
    'calme', 'attentif', 'sage', 'travailleur', 'respectueux',
    'participatif', 'exemplaire', 'serieux'
}

# Modèle de sentiment français
SENTIMENT_MODEL_NAME = "nlptown/bert-base-multilingual-uncased-sentiment"
sentiment_tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL_NAME)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(SENTIMENT_MODEL_NAME)

# Détection de thèmes
theme_classifier = pipeline(
    "zero-shot-classification",
    model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli",
    device=0 if torch.cuda.is_available() else -1
)

keybert_model = KeyBERT("paraphrase-multilingual-MiniLM-L12-v2")

def preprocess_text(text: str) -> str:
    text = unicodedata.normalize('NFD', text)
    text = ''.join([c for c in text if not unicodedata.combining(c)])
    return re.sub(r'[^\w\s]', '', text.lower()).strip()

def detect_keywords(text: str) -> str:
    cleaned = preprocess_text(text)
    if any(re.search(rf'\b{re.escape(kw)}\b', cleaned) for kw in NEGATIVE_KEYWORDS):
        return 'negative'
    if any(re.search(rf'\b{re.escape(kw)}\b', cleaned) for kw in POSITIVE_KEYWORDS):
        return 'positive'
    return 'neutral'

def analyze_sentiment(text: str) -> dict:
    try:
        # Détection lexicale prioritaire
        keyword_result = detect_keywords(text)
        if keyword_result != 'neutral':
            return {'label': keyword_result, 'confidence': 0.95}
        
        # Analyse par modèle
        inputs = sentiment_tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        )
        
        with torch.no_grad():
            outputs = sentiment_model(**inputs)
        
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        confidence, pred = torch.max(probs, dim=1)
        
        return {
            'label': ['negative', 'negative', 'neutral', 'positive', 'positive'][pred.item()],
            'confidence': confidence.item()
        }
        
    except Exception as e:
        logger.error(f"Erreur analyse: {str(e)}")
        return {'label': 'neutral', 'confidence': 0.0}

THEME_CATEGORIES = ["comportement", "apprentissage", "social", "émotions"]

def detect_themes(text: str) -> list:
    try:
        # Classification zero-shot
        zs_result = theme_classifier(
            text,
            candidate_labels=THEME_CATEGORIES,
            multi_label=True,
            hypothesis_template="Ce texte concerne le thème du {}."
        )
        zs_themes = [label for label, score in zip(zs_result['labels'], zs_result['scores']) if score > 0.5]
        
        # Extraction de mots-clés
        keywords = keybert_model.extract_keywords(
            text,
            keyphrase_ngram_range=(1, 2),
            stop_words="french",
            diversity=0.5
        )
        kw_themes = [preprocess_text(kw[0]) for kw in keywords if kw[1] > 0.3]
        
        return list(set(zs_themes + kw_themes))
        
    except Exception as e:
        logger.error(f"Erreur thèmes: {str(e)}")
        return []

SUGGESTION_DB = {
    'comportement': [
        "Renforcer les encouragements positifs",
        "Mettre en place un système de récompense"
    ],
    'social': [
        "Encourager les activités de groupe",
        "Organiser des jeux coopératifs"
    ]
}

@app.route('/analyze', methods=['POST'])
def analyze():
    if not request.is_json:
        return jsonify({"error": "Format JSON requis"}), 400
    
    data = request.get_json()
    text = data.get('text', '').strip()
    
    if len(text) < 5:
        return jsonify({"error": "Texte trop court"}), 400
    
    try:
        # Analyse sentiment
        sentiment = analyze_sentiment(text)
        
        # Détection thèmes
        themes = detect_themes(text)
        
        # Suggestions
        suggestions = []
        if sentiment['label'] == 'positive':
            suggestions.append("Valoriser les bonnes attitudes")
        elif sentiment['label'] == 'negative':
            suggestions.append("Évaluer les causes du comportement")
            
        suggestions += SUGGESTION_DB.get(themes[0] if themes else 'default', [])
        
        return jsonify({
            "sentiment": sentiment['label'].upper(),
            "confidence": round(sentiment['confidence'], 2),
            "themes": themes,
            "suggestions": suggestions if suggestions else ["Observation nécessaire"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)