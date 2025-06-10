package com.example.garderie.controllers;

import com.example.garderie.dto.ReclamationDto;
import com.example.garderie.entities.Reclamation;
import com.example.garderie.entities.User;
import com.example.garderie.services.ModerationService;
import com.example.garderie.services.ReclamationService;
import com.example.garderie.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {

    private final ReclamationService reclamationService;
    private final UserService userService;
    private final ModerationService moderationService;

    public ReclamationController(ReclamationService reclamationService,
                                 UserService userService,
                                 ModerationService moderationService) {
        this.reclamationService = reclamationService;
        this.userService = userService;
        this.moderationService = moderationService;
    }

    @PostMapping("/parent/{parentId}")
    public ResponseEntity<?> createReclamation(
            @PathVariable Long parentId,
            @RequestBody Reclamation reclamation) {
        try {
            Optional<User> parent = userService.findById(parentId);
            if (parent.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "status", "error",
                                "message", "Parent non trouvé avec l'ID: " + parentId
                        ));
            }

            // Analyse stricte du message
            ModerationService.ModerationResult result = moderationService.analyzeMessage(reclamation.getMessage());

            if (result.isBlocked()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "status", "rejected",
                                "message", result.responseMessage(),
                                "code", "CONTENT_BLOCKED"
                        ));
            }

            reclamation.setParent(parent.get());
            reclamation.setDateEnvoi(LocalDateTime.now());

            if (result.responseMessage() != null) {
                reclamation.setReponseAuto(result.responseMessage());
                reclamation.setModerationStatus("WARNED");
            } else {
                reclamation.setModerationStatus("CLEAN");
            }

            Reclamation saved = reclamationService.save(reclamation);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(saved));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Erreur lors de la création de la réclamation"
                    ));
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getAllReclamations() {
        try {
            List<Reclamation> reclamations = reclamationService.findAll();
            List<ReclamationDto> dtos = reclamations.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Erreur lors de la récupération des réclamations"
                    ));
        }
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<?> getReclamationsByParent(@PathVariable Long parentId) {
        try {
            Optional<User> parent = userService.findById(parentId);
            if (parent.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "status", "error",
                                "message", "Parent non trouvé"
                        ));
            }

            List<Reclamation> reclamations = reclamationService.findByParent(parent.get());
            return ResponseEntity.ok(reclamations.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Erreur lors de la récupération"
                    ));
        }
    }

    @PutMapping("/{reclamationId}/status")
    public ResponseEntity<?> updateReclamationStatus(
            @PathVariable Long reclamationId,
            @RequestParam boolean traite) {
        try {
            Optional<Reclamation> reclamationOpt = reclamationService.findById(reclamationId);
            if (reclamationOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "status", "error",
                                "message", "Réclamation non trouvée"
                        ));
            }

            Reclamation reclamation = reclamationOpt.get();
            reclamation.setTraite(traite);
            reclamationService.save(reclamation);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Statut mis à jour",
                    "traite", traite
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Erreur lors de la mise à jour"
                    ));
        }
    }

    // *** NOUVEAU : Réponse admin à une réclamation ***
    @PutMapping("/{reclamationId}/reponse")
    public ResponseEntity<?> repondreAReclamation(
            @PathVariable Long reclamationId,
            @RequestBody Map<String, String> requestBody) {

        try {
            Optional<Reclamation> reclamationOpt = reclamationService.findById(reclamationId);
            if (reclamationOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "status", "error",
                                "message", "Réclamation non trouvée"
                        ));
            }

            String reponse = requestBody.get("reponseAdmin");
            if (reponse == null || reponse.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "status", "error",
                                "message", "La réponse de l’admin ne peut pas être vide"
                        ));
            }

            Reclamation reclamation = reclamationOpt.get();
            reclamation.setReponseAdmin(reponse);
            reclamation.setTraite(true); // optionnel : marquer la réclamation comme traitée
            reclamationService.save(reclamation);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Réponse ajoutée avec succès"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Erreur lors de la réponse"
                    ));
        }
    }

    private ReclamationDto convertToDto(Reclamation reclamation) {
        return new ReclamationDto(
                reclamation.getId(),
                reclamation.getObjet(),
                reclamation.getMessage(),
                reclamation.getDateEnvoi(),
                reclamation.getParent().getId_utilisateur(),
                reclamation.getParent().getNom() + " " + reclamation.getParent().getPrenom(),
                reclamation.isTraite(),
                reclamation.getReponseAuto(),
                reclamation.getModerationStatus(),
                reclamation.getReponseAdmin() // bien penser à ajouter ce champ dans le DTO !
        );
    }
}
