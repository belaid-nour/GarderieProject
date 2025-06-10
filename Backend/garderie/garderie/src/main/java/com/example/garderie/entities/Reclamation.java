package com.example.garderie.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String objet;
    private String message;
    private LocalDateTime dateEnvoi;
    private boolean traite = false;

    @Column(name = "reponse_auto", length = 500)
    private String reponseAuto;

    @Column(name = "moderation_status")
    private String moderationStatus; // Nouveau champ

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private User parent;
    @Column(columnDefinition = "TEXT")
    private String reponseAdmin;

    // Lombok @Data génère automatiquement les getters/setters
    // Mais vous pouvez les ajouter manuellement si nécessaire :

    public void setModerationStatus(String status) {
        this.moderationStatus = status;
    }

    public String getModerationStatus() {
        return this.moderationStatus;
    }
}