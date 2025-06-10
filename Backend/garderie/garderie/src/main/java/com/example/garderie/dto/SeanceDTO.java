package com.example.garderie.dto;

import java.time.LocalTime;
import com.example.garderie.entities.Seance.RecurrenceType;

public record SeanceDTO(
        String nom,
        LocalTime horaireDebut,
        LocalTime horaireFin,
        Long classeId,
        Long enseignantId,
        boolean obligatoire,
        String lieu,
        String startDate,
        String endDate,
        RecurrenceType recurrenceType
) {}