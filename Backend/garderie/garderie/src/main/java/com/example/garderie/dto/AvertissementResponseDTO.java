package com.example.garderie.dto;

import com.example.garderie.entities.Avertissement;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AvertissementResponseDTO(
        Long id,
        String titre,
        String description,
        Avertissement.Severite severite,
        LocalDateTime dateCreation,
        Long enseignantId,
        String enseignantNomComplet,
        Long enfantId,
        String enfantNomComplet
) {
    public static AvertissementResponseDTO fromEntity(Avertissement avertissement) {
        return AvertissementResponseDTO.builder()
                .id(avertissement.getId())
                .titre(avertissement.getTitre())
                .description(avertissement.getDescription())
                .severite(avertissement.getSeverite())
                .dateCreation(avertissement.getDateCreation())
                .enseignantId(avertissement.getEnseignant().getId_utilisateur())
                .enseignantNomComplet(avertissement.getEnseignant().getNom() + " " +
                        avertissement.getEnseignant().getPrenom())
                .enfantId(avertissement.getEnfant().getId())
                .enfantNomComplet(avertissement.getEnfant().getNom() + " " +
                        avertissement.getEnfant().getPrenom())
                .build();
    }
}
