package com.example.garderie.dto;

import com.example.garderie.entities.Avertissement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvertissementDTO {

    private Long id;

    @NotBlank(message = "Le titre ne peut pas être vide")
    @Size(max = 100, message = "Le titre ne peut pas dépasser 100 caractères")
    private String titre;

    @NotBlank(message = "La description ne peut pas être vide")
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;

    @NotNull(message = "La sévérité est obligatoire")
    private Avertissement.Severite severite;

    private LocalDateTime dateCreation;

    @NotNull(message = "L'ID de l'enseignant est obligatoire")
    private Long enseignantId;

    @NotNull(message = "L'ID de l'enfant est obligatoire")
    private Long enfantId;

    // Champ calculé (ne sera pas utilisé pour la création)
    private String enfantNomComplet;

    public String getEnfantNomComplet() {
        return this.enfantNomComplet != null ? this.enfantNomComplet : "";
    }
}
