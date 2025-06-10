package com.example.garderie.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct; // Import corrigé pour Spring Boot 3+

@Data
@Configuration
@ConfigurationProperties(prefix = "konnect")
public class KonnectConfig {
    private Api api;
    private Wallet wallet;
    private Callback callback;

    @PostConstruct
    public void validateConfig() {
        if (api == null || wallet == null || callback == null) {
            throw new IllegalStateException("Configuration Konnect incomplète dans application.yml");
        }

        System.out.println("\n=== Configuration Konnect Chargée ===");
        System.out.println("API URL: " + getApiUrl());
        System.out.println("API Key: " + getApiKey());
        System.out.println("Wallet ID: " + getWalletId());
        System.out.println("Callback URL: " + getCallbackUrl() + "\n");
    }

    public String getApiUrl() {
        return api != null ? api.url : "NON_CONFIGURÉ";
    }

    public String getApiKey() {
        return api != null ? api.key : "NON_CONFIGURÉ";
    }

    public String getWalletId() {
        return wallet != null ? wallet.id : "NON_CONFIGURÉ";
    }

    public String getCallbackUrl() {
        return callback != null ? callback.url : "NON_CONFIGURÉ";
    }

    @Data
    public static class Api {
        private String url;
        private String key;
    }

    @Data
    public static class Wallet {
        private String id;
    }

    @Data
    public static class Callback {
        private String url;
    }
}