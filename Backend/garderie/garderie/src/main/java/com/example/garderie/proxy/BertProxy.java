package com.example.garderie.proxy;

import com.example.garderie.dto.AIAnalysisDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class BertProxy {

    private final RestTemplate restTemplate;
    private static final String SERVICE_NAME = "bertService";
    private static final String FALLBACK_METHOD = "fallbackAnalysis";

    @CircuitBreaker(name = SERVICE_NAME, fallbackMethod = FALLBACK_METHOD)
    public AIAnalysisDTO analyze(String text) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<AIAnalysisDTO> response = restTemplate.exchange(
                    "http://localhost:5000/analyze",
                    HttpMethod.POST,
                    new HttpEntity<>(Map.of("text", text), headers),
                    AIAnalysisDTO.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }

            throw new RuntimeException("Réponse invalide du service BERT");

        } catch (Exception e) {
            log.error("Erreur lors de l'appel à BERT: {}", e.getMessage(), e);
            throw e; // Propage pour déclencher le fallback
        }
    }

    private AIAnalysisDTO fallbackAnalysis(String text, Throwable t) {
        log.warn("Fallback appelé pour analyse BERT: {}", t.toString());
        return AIAnalysisDTO.builder()
                .sentiment("NON_DÉTERMINÉ")
                .confidence(0.0)
                .error("Service BERT indisponible: " + t.getMessage())
                .build();
    }
}
