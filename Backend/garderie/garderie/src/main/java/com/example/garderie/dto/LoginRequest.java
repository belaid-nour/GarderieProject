package com.example.garderie.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String motDePasse;
}
