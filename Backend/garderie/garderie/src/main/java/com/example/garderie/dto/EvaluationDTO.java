// EvaluationDTO.java
package com.example.garderie.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EvaluationDTO {
    private Long enfantId;
    private Long seanceId;
    private LocalDate date;
    private String commentaire;

    @NotNull(message = "L'ID de l'enfant est obligatoire")
    public Long getEnfantId() {
        return enfantId;
    }

    @NotNull(message = "L'ID de la séance est obligatoire")
    public Long getSeanceId() {
        return seanceId;
    }

    @NotBlank(message = "Le commentaire ne peut pas être vide")
    public String getCommentaire() {
        return commentaire;
    }
}