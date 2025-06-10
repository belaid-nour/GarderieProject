package com.example.garderie.services;

import com.example.garderie.ai.EvaluationAIAnalyzer;
import com.example.garderie.dto.AIAnalysisDTO;
import com.example.garderie.proxy.BertProxy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class HybridAnalysisService {

    private final EvaluationAIAnalyzer ruleAnalyzer;
    private final BertProxy bertProxy;

    public AIAnalysisDTO analyze(String text) {
        try {
            // Analyse avec BERT en premier
            AIAnalysisDTO bertResult = bertProxy.analyze(text);

            // Si BERT a réussi, on utilise ses résultats
            if (bertResult.getError() == null) {
                return bertResult;
            }

            // Fallback à l'analyse par règles si BERT échoue
            return ruleAnalyzer.analyzeEvaluationContent(text);

        } catch (Exception e) {
            // Double fallback si tout échoue
            return AIAnalysisDTO.builder()
                    .sentiment("NEUTRE")
                    .confidence(0.0)
                    .suggestions(List.of("Service d'analyse temporairement indisponible"))
                    .error("Erreur lors de l'analyse: " + e.getMessage())
                    .build();
        }
    }
}