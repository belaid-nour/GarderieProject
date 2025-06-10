package com.example.garderie.services;

import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class ModerationService {

    // Liste étendue de mots et expressions interdits
    private final Set<String> badWords = Set.of(
            // Insultes directes
            "idiot", "nul", "stupide", "débile", "abruti", "crétin", "imbécile",
            "connard", "enculé", "fils de pute", "salaud", "batard", "pourriture",
            "merde", "putain", "bordel", "chien", "salope", "gueule", "nique",

            // Termes dépréciatifs
            "inutile", "nul à chier", "ça craint", "à chier", "de merde",
            "je déteste", "je hais", "je méprise",

            // Expressions courantes impolies
            "va te faire", "casse toi", "ferme ta", "ta gueule", "t'es con",
            "tu pues", "dégage", "je m'en fous", "je m'en branle",

            // Variantes orthographiques
            "connar", "encul", "fdp", "ptn", "mrd", "nul a chier"
    );

    // Mots déclencheurs de tonalité négative
    private final Set<String> negativeTriggers = Set.of(
            "pas content", "mécontent", "insatisfait", "déçu", "horrible",
            "catastrophe", "inacceptable", "scandale", "honteux", "révoltant"
    );

    public ModerationResult analyzeMessage(String message) {
        String lowerMsg = message.toLowerCase();

        // Détection mots interdits
        boolean containsBadWord = badWords.stream()
                .anyMatch(badWord -> lowerMsg.contains(badWord));

        // Détection tonalité négative
        boolean isNegative = negativeTriggers.stream()
                .anyMatch(trigger -> lowerMsg.contains(trigger));

        // Construction réponse
        if (containsBadWord) {
            return new ModerationResult(
                    true,
                    "Votre message contient des termes inappropriés et ne peut être accepté.",
                    "BLOCK"
            );
        } else if (isNegative) {
            return new ModerationResult(
                    false,
                    "Attention : votre message semble exprimer une forte insatisfaction. " +
                            "Merci de formuler vos remarques de manière constructive.",
                    "WARN"
            );
        }

        return new ModerationResult(false, null, "OK");
    }

    public record ModerationResult(
            boolean isBlocked,
            String responseMessage,
            String severity
    ) {}
}