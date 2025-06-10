package com.example.garderie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnfantDTO {
    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String niveau;
    private boolean bus;
    private boolean club;
    private boolean gouter;
    private boolean tablier;
    private boolean livre;
    private String sexe;
    private Long classeId;
}