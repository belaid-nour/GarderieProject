package com.example.garderie.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Enfant enfant;

    @ManyToOne
    private User parent;

    private double montant;
    private LocalDateTime dateEmission;
    private LocalDateTime datePaiement;
    private String statut; // "EN_ATTENTE", "PAYE", "ECHEC"
    private String referencePaiement;
    private String paymentUrl;
}