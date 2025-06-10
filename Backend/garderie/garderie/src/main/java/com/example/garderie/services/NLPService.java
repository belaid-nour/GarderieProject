package com.example.garderie.services;

import com.example.garderie.ai.FrenchNLPProcessor;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class NLPService {

    private final FrenchNLPProcessor nlpProcessor;

    public NLPService(FrenchNLPProcessor nlpProcessor) {
        this.nlpProcessor = nlpProcessor;
    }


}
