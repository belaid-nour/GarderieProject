package com.example.garderie.dto;

import lombok.Data;

@Data
public class KonnectPaymentResponse {
    private String payUrl;
    private String paymentRef;
    private String status;
}