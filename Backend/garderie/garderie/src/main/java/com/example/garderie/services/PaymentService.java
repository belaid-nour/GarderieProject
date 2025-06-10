package com.example.garderie.services;

import com.example.garderie.configuration.KonnectConfig;
import com.example.garderie.dto.KonnectPaymentRequest;
import com.example.garderie.dto.KonnectPaymentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private static final String INIT_PAYMENT_PATH = "/payments/init-payment";

    @Autowired private KonnectConfig konnectConfig;
    @Autowired private ObjectMapper objectMapper;

    public KonnectPaymentResponse initiatePayment(
            String factureId,
            double amount,
            String email,
            String fullName) throws Exception {

        validateConfiguration();
        KonnectPaymentRequest request = buildPaymentRequest(factureId, amount, email, fullName);
        return executePaymentRequest(request);
    }

    private void validateConfiguration() {
        if (konnectConfig.getApiKey() == null || konnectConfig.getWalletId() == null) {
            logger.error("Configuration Konnect manquante - Key: {}, Wallet: {}",
                    konnectConfig.getApiKey(), konnectConfig.getWalletId());
            throw new IllegalStateException("Configuration de paiement incomplète");
        }
    }

    private KonnectPaymentRequest buildPaymentRequest(String factureId, double amount,
                                                      String email, String fullName) {
        KonnectPaymentRequest request = new KonnectPaymentRequest();
        request.setReceiverWalletId(konnectConfig.getWalletId());
        request.setAmount((int) Math.round(amount * 100));
        request.setDescription("Facture #" + factureId);
        request.setOrderId(factureId);
        request.setWebhook(konnectConfig.getCallbackUrl());
        request.setEmail(email);

        // Gestion du nom complet
        String[] nameParts = fullName.trim().split("\\s+", 2);
        request.setFirstName(nameParts.length > 0 ? nameParts[0] : "");
        request.setLastName(nameParts.length > 1 ? nameParts[1] : "");

        return request;
    }

    private KonnectPaymentResponse executePaymentRequest(KonnectPaymentRequest request) throws Exception {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = createHttpPost(request);
            return processHttpResponse(httpClient.execute(httpPost));
        }
    }

    private HttpPost createHttpPost(KonnectPaymentRequest request) throws Exception {
        // Correction cruciale : Construction correcte de l'URL
        String fullUrl = konnectConfig.getApiUrl() + INIT_PAYMENT_PATH;
        HttpPost httpPost = new HttpPost(fullUrl);

        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("x-api-key", konnectConfig.getApiKey());

        String jsonRequest = objectMapper.writeValueAsString(request);
        logger.debug("Requête Konnect : {}", jsonRequest);
        httpPost.setEntity(new StringEntity(jsonRequest));

        return httpPost;
    }

    private KonnectPaymentResponse processHttpResponse(HttpResponse response) throws Exception {
        int statusCode = response.getStatusLine().getStatusCode();
        String responseBody = EntityUtils.toString(response.getEntity());
        logger.info("Réponse Konnect [{}] : {}", statusCode, responseBody);

        if (statusCode != 200) {
            handlePaymentError(statusCode, responseBody);
        }
        return objectMapper.readValue(responseBody, KonnectPaymentResponse.class);
    }

    private void handlePaymentError(int statusCode, String responseBody) {
        String errorMsg = "Erreur API Konnect - Code: " + statusCode;
        logger.error(errorMsg);

        // Messages d'erreur spécifiques selon le code HTTP
        String detailedError;
        if (statusCode == 404) {
            detailedError = "Endpoint introuvable - Vérifiez l'URL de l'API";
        } else if (statusCode == 401) {
            detailedError = "Clé API invalide ou non autorisée";
        } else if (statusCode >= 500) {
            detailedError = "Erreur serveur chez le fournisseur de paiement";
        } else {
            detailedError = "Échec de l'initialisation du paiement";
        }

        throw new RuntimeException(detailedError + " | Code: " + statusCode);
    }
}