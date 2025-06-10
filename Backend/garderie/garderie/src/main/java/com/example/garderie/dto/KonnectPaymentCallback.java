package com.example.garderie.dto;

import lombok.Data;

@Data
public class KonnectPaymentCallback {
    private String paymentRef;
    private String status; // "completed", "failed", etc.
    private String orderId;
    private int amount;
    // Ajoutez d'autres champs selon la documentation Konnect
}