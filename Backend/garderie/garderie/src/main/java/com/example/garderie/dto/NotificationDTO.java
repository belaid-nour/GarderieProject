package com.example.garderie.dto;

import java.time.LocalDateTime;

public record NotificationDTO(
        Long id,
        String message,
        boolean lue,
        LocalDateTime dateCreation,
        Long parentId,
        Long absenceId,
        Long avertissementId
) {}