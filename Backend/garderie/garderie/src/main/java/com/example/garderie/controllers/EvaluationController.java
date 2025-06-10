package com.example.garderie.controllers;

import com.example.garderie.dto.AIAnalysisDTO;
import com.example.garderie.dto.ErrorResponse;
import com.example.garderie.dto.EvaluationDTO;
import com.example.garderie.entities.Evaluation;
import com.example.garderie.exceptions.BusinessRuleException;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.services.EvaluationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin("*")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping
    public ResponseEntity<?> creerEvaluation(@Valid @RequestBody EvaluationDTO evaluationDTO) {
        try {
            Evaluation nouvelleEvaluation = evaluationService.creerEvaluation(evaluationDTO);
            return new ResponseEntity<>(nouvelleEvaluation, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("SERVER_ERROR",
                            "Erreur lors de la création de l'évaluation: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/analyse-ia")
    public ResponseEntity<?> getAnalyseIA(@PathVariable Long id) {
        try {
            AIAnalysisDTO resultat = evaluationService.recupererResultatsAnalyse(id);
            return ResponseEntity.ok(resultat);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ErrorResponse("NOT_FOUND", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ErrorResponse("AI_ERROR", "Erreur lors de l'analyse IA"));
        }
    }

    @PostMapping("/{id}/reanalyse")
    public ResponseEntity<?> relancerAnalyseIA(@PathVariable Long id) {
        try {
            Evaluation evaluation = evaluationService.reanalyserEvaluation(id);
            return ResponseEntity.ok(evaluation);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ErrorResponse("NOT_FOUND", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ErrorResponse("AI_ERROR", "Erreur lors de l'analyse IA"));
        }
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<List<Evaluation>> getParEnfant(@PathVariable Long enfantId) {
        return ResponseEntity.ok(evaluationService.listerEvaluationsEnfant(enfantId));
    }

    @GetMapping("/seance/{seanceId}")
    public ResponseEntity<List<Evaluation>> getParSeance(@PathVariable Long seanceId) {
        return ResponseEntity.ok(evaluationService.listerEvaluationsSeance(seanceId));
    }

    @GetMapping("/classe/{classeId}")
    public ResponseEntity<List<Evaluation>> getParClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(evaluationService.listerEvaluationsClasse(classeId));
    }
}
