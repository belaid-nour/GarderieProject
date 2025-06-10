package com.example.garderie.controllers;

import com.example.garderie.dto.KonnectPaymentResponse;
import com.example.garderie.dto.PaymentRequestDTO;
import com.example.garderie.entities.Facture;
import com.example.garderie.entities.User;
import com.example.garderie.repository.UserRepository;
import com.example.garderie.services.FactureService;
import com.example.garderie.services.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;
    private final FactureService factureService;
    private final UserRepository userRepository;

    @Autowired
    public PaymentController(PaymentService paymentService,
                             FactureService factureService,
                             UserRepository userRepository) {
        this.paymentService = paymentService;
        this.factureService = factureService;
        this.userRepository = userRepository;
    }

    @PostMapping("/initiate/{enfantId}")
    public ResponseEntity<?> initiatePayment(
            @PathVariable Long enfantId,
            @RequestBody PaymentRequestDTO paymentRequest,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Tentative de paiement non authentifiée");
            return ResponseEntity.status(401).body("Authentification requise");
        }

        try {
            String username = authentication.getName();
            User parent = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            logger.info("Init paiement - Enfant: {}, Montant: {}, Parent: {}",
                    enfantId, paymentRequest.getAmount(), parent.getNom());

            // Validation du montant
            if (paymentRequest.getAmount() <= 0) {
                return ResponseEntity.badRequest().body("Montant invalide");
            }

            // Création de la facture
            Facture facture = factureService.createFacture(enfantId, parent, paymentRequest.getAmount());
            logger.info("Facture créée: ID={}", facture.getId());

            // Construction du nom complet
            String fullName = (parent.getPrenom() != null ? parent.getPrenom() : "") + " " +
                    (parent.getNom() != null ? parent.getNom() : "");

            // Initialisation du paiement
            KonnectPaymentResponse response = paymentService.initiatePayment(
                    facture.getId().toString(),
                    paymentRequest.getAmount(),
                    parent.getEmail(),
                    fullName.trim()
            );

            // Validation de la réponse
            if (response.getPaymentRef() == null || response.getPayUrl() == null) {
                throw new RuntimeException("Réponse invalide du service de paiement");
            }

            // Mise à jour de la facture
            facture.setReferencePaiement(response.getPaymentRef());
            facture.setPaymentUrl(response.getPayUrl());
            factureService.save(facture);

            logger.info("Paiement initié - Ref: {}", response.getPaymentRef());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            logger.error("ERREUR PAIEMENT - Enfant: {}, Erreur: {}", enfantId, e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERREUR SYSTEME - Enfant: {}, Erreur: {}", enfantId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Erreur technique: " + e.getMessage());
        }
    }
}