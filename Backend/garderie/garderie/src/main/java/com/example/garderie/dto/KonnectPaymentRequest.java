package com.example.garderie.dto;

import lombok.Data;

@Data
public class KonnectPaymentRequest {
    private String receiverWalletId;
    private int amount; // Montant en centimes (envoyé par le front)
    private String description;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String orderId;
    private String webhook;
}