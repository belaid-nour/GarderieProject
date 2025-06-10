package com.example.garderie.ai;

import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
public class FrenchNLPProcessor {

    private final TokenizerME tokenizer;

    public FrenchNLPProcessor() throws IOException {
        this.tokenizer = loadTokenizer();
    }

    private TokenizerME loadTokenizer() throws IOException {
        try (InputStream modelStream = new ClassPathResource("models/nlp/fr/fr-tokens.bin").getInputStream()) {
            return new TokenizerME(new TokenizerModel(modelStream));
        }
    }

    public String correctSpelling(String text) {
        // Implémentation basique pour l'exemple
        return text.replaceAll("(\\w)\\1{2,}", "$1$1"); // Correction des répétitions de lettres
    }

    public String normalizeText(String text) {
        return text != null ?
                text.toLowerCase()
                        .replaceAll("[^a-zàâçéèêëîïôûùüÿñæœ\\d'’\\- ]", " ")
                        .replaceAll("\\s+", " ")
                        .trim() : "";
    }

    public String[] tokenize(String sentence) {
        return sentence != null && !sentence.isEmpty() ?
                tokenizer.tokenize(sentence) : new String[0];
    }
}