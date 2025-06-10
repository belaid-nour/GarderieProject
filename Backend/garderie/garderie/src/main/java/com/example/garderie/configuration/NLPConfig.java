package com.example.garderie.configuration;

import com.example.garderie.ai.FrenchNLPProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NLPConfig {

    @Bean
    public FrenchNLPProcessor frenchNLPProcessor() throws Exception {
        return new FrenchNLPProcessor();
    }
}
