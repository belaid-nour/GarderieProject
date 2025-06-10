package com.example.garderie.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReclamationDto {
    private Long id;
    private String objet;
    private String message;
    private LocalDateTime dateEnvoi;
    private Long parentId;
    private String parentNomComplet;
    private boolean traite;
    private String reponseAuto;
    private String moderationStatus;
    private String reponseAdmin;
}
