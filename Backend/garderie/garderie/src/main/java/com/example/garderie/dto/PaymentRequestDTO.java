package com.example.garderie.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private double amount; // Montant calculé par le front
    private String description; // Optionnel
}