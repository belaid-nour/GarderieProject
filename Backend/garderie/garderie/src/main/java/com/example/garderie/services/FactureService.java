package com.example.garderie.services;

import com.example.garderie.entities.Enfant;
import com.example.garderie.entities.Facture;
import com.example.garderie.entities.User;
import com.example.garderie.repository.EnfantRepository;
import com.example.garderie.repository.FactureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private EnfantRepository enfantRepository;

    @Transactional
    public Facture createFacture(Long enfantId, User parent, double amount) {
        Enfant enfant = enfantRepository.findById(enfantId)
                .orElseThrow(() -> new IllegalArgumentException("Enfant non trouvé"));

        Facture facture = new Facture();
        facture.setEnfant(enfant);
        facture.setParent(parent);
        facture.setMontant(amount);
        facture.setDateEmission(LocalDateTime.now());
        facture.setStatut("EN_ATTENTE");

        return factureRepository.save(facture);
    }

    @Transactional
    public Facture save(Facture facture) {
        return factureRepository.save(facture);
    }

    @Transactional
    public void updatePaymentStatus(String paymentRef, String status) {
        Optional<Facture> factureOpt = factureRepository.findByReferencePaiement(paymentRef);
        if (factureOpt.isPresent()) {
            Facture facture = factureOpt.get();
            facture.setStatut(mapStatus(status));
            if ("completed".equalsIgnoreCase(status)) {
                facture.setDatePaiement(LocalDateTime.now());
            }
            factureRepository.save(facture);
        }
    }

    private String mapStatus(String konnectStatus) {
        if (konnectStatus == null) return "EN_ATTENTE";

        return switch (konnectStatus.toLowerCase()) {
            case "completed" -> "PAYE";
            case "failed" -> "ECHEC";
            default -> "EN_ATTENTE";
        };
    }
}