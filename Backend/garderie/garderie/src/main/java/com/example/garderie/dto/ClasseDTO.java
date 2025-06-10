package com.example.garderie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClasseDTO {
    private Long id;
    private String nom;
    private String niveau;
    private String annee; // Nouvelle propriété pour l'année
    private int effectifMax; // Nouvelle propriété pour le nombre maximum d'enfants
    private List<EnfantDTO> enfants;
}
