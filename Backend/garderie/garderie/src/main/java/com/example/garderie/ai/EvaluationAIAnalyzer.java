package com.example.garderie.ai;

import com.example.garderie.dto.AIAnalysisDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;

@Service
public class EvaluationAIAnalyzer {

    @Value("${ai.sentiment.threshold.positive:0.15}")
    private double positiveThreshold;

    @Value("${ai.sentiment.threshold.negative:-0.15}")
    private double negativeThreshold;

    private final Map<String, Double> sentimentLexicon = Map.of(
            "bon", 0.5,
            "excellent", 0.8,
            "mauvais", -0.6,
            "sage", 0.7,
            "agit", -0.5
    );

    private final Map<String, List<String>> themePatterns = Map.of(
            "éducation", List.of("apprendre", "école", "devoirs"),
            "comportement", List.of("sage", "écoute", "respect"),
            "social", List.of("ami", "partager", "groupe")
    );

    public AIAnalysisDTO analyzeEvaluationContent(String commentaire) {
        AIAnalysisDTO.AIAnalysisDTOBuilder builder = AIAnalysisDTO.builder();

        try {
            String processedText = preprocessText(commentaire);
            double sentimentScore = analyzeSentiment(processedText);
            List<String> themes = detectThemes(processedText);

            builder.sentiment(determineSentiment(sentimentScore))
                    .confidence(calculateConfidence(sentimentScore, themes.size()))
                    .themes(themes)
                    .suggestions(generateSuggestions(themes, determineSentiment(sentimentScore)));

        } catch (Exception e) {

        }

        return builder.build();
    }

    private String preprocessText(String text) {
        return Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase();
    }

    private double analyzeSentiment(String text) {
        String[] tokens = text.split("\\s+");
        double totalScore = 0;
        int significantWords = 0;

        for (String token : tokens) {
            String lemma = normalizeLemma(token);
            Double score = sentimentLexicon.getOrDefault(lemma, 0.0);
            if (score != 0) significantWords++;
            totalScore += score;
        }

        return significantWords > 0 ? totalScore / significantWords : 0;
    }

    private List<String> detectThemes(String text) {
        List<String> detectedThemes = new ArrayList<>();
        String lowerText = text.toLowerCase();

        themePatterns.forEach((theme, keywords) -> {
            if (keywords.stream().anyMatch(lowerText::contains)) {
                detectedThemes.add(theme);
            }
        });

        return detectedThemes;
    }

    private String determineSentiment(double score) {
        if (score > positiveThreshold) return "POSITIF";
        if (score < negativeThreshold) return "NÉGATIF";
        return "NEUTRE";
    }

    private List<String> generateSuggestions(List<String> themes, String sentiment) {
        List<String> suggestions = new ArrayList<>();

        if ("NÉGATIF".equals(sentiment)) {
            suggestions.add("Envisager un suivi individuel");
        } else if ("POSITIF".equals(sentiment)) {
            suggestions.add("Encourager à continuer");
        }

        themes.forEach(theme -> {
            if ("éducation".equals(theme)) {
                suggestions.add("Adapter les méthodes d'apprentissage");
            } else if ("comportement".equals(theme)) {
                suggestions.add("Travailler sur la gestion des émotions");
            }
        });

        return suggestions.isEmpty() ? List.of("Aucune suggestion spécifique") : suggestions;
    }

    private double calculateConfidence(double sentimentScore, int themeCount) {
        return Math.min(1.0, (Math.abs(sentimentScore) * 0.7) + (themeCount * 0.3));
    }



    private String normalizeLemma(String token) {
        return token.replaceAll("[^a-zA-Z]", "").toLowerCase();
    }
}