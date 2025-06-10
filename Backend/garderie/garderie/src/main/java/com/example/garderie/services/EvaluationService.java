package com.example.garderie.services;

import com.example.garderie.ai.EvaluationAIAnalyzer;
import com.example.garderie.dto.AIAnalysisDTO;
import com.example.garderie.dto.EvaluationDTO;
import com.example.garderie.entities.Enfant;
import com.example.garderie.entities.Evaluation;
import com.example.garderie.exceptions.BusinessRuleException;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.repository.EnfantRepository;
import com.example.garderie.repository.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final EnfantRepository enfantRepository;
    private final EvaluationAIAnalyzer evaluationAIAnalyzer;

    @Transactional
    public Evaluation creerEvaluation(EvaluationDTO dto) {
        Enfant enfant = enfantRepository.findById(dto.getEnfantId())
                .orElseThrow(() -> new ResourceNotFoundException("Enfant non trouvé"));

        Evaluation evaluation = new Evaluation();
        evaluation.setEnfant(enfant);
        evaluation.setSeanceId(dto.getSeanceId());
        evaluation.setCommentaire(dto.getCommentaire());

        if (dto.getCommentaire() != null && !dto.getCommentaire().isBlank()) {
            AIAnalysisDTO analyse = evaluationAIAnalyzer.analyzeEvaluationContent(dto.getCommentaire());

            evaluation.setSentiment(analyse.getSentiment());
            evaluation.setConfidence(analyse.getConfidence());

            if (analyse.getThemes() != null) {
                evaluation.getThemes().addAll(analyse.getThemes());
            }

            if (analyse.getSuggestions() != null) {
                evaluation.getSuggestions().addAll(analyse.getSuggestions());
            }
        }

        return evaluationRepository.save(evaluation);
    }

    public AIAnalysisDTO recupererResultatsAnalyse(Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Évaluation non trouvée"));

        return AIAnalysisDTO.builder()
                .sentiment(evaluation.getSentiment())
                .confidence(evaluation.getConfidence())
                .themes(evaluation.getThemes())
                .suggestions(evaluation.getSuggestions())
                .build();
    }

    @Transactional
    public Evaluation reanalyserEvaluation(Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Évaluation non trouvée"));

        if (evaluation.getCommentaire() != null && !evaluation.getCommentaire().isBlank()) {
            AIAnalysisDTO analyse = evaluationAIAnalyzer.analyzeEvaluationContent(evaluation.getCommentaire());
            evaluation.setSentiment(analyse.getSentiment());
            evaluation.setConfidence(analyse.getConfidence());
            evaluation.setThemes(analyse.getThemes());
            evaluation.setSuggestions(analyse.getSuggestions());
        }

        return evaluationRepository.save(evaluation);
    }

    public List<Evaluation> listerEvaluationsEnfant(Long enfantId) {
        return evaluationRepository.findByEnfantIdOrderByDateDesc(enfantId);
    }

    public List<Evaluation> listerEvaluationsSeance(Long seanceId) {
        return evaluationRepository.findBySeanceIdOrderByEnfantNomAsc(seanceId);
    }

    public List<Evaluation> listerEvaluationsClasse(Long classeId) {
        return evaluationRepository.findByEnfantClasseIdOrderByDateDesc(classeId);
    }
}