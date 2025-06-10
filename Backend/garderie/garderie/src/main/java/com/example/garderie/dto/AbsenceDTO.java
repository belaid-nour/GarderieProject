package com.example.garderie.dto;

import java.time.LocalDate;
public record AbsenceDTO(
        Long id,
        Long enfantId,
        Long seanceId,
        LocalDate date,
        String raison,
        boolean justifiee,
        boolean present // 👈 Ajouter si nécessaire
) {}