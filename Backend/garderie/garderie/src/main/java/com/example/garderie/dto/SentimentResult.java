package com.example.garderie.dto;

public record SentimentResult(
        String label,
        double score,
        java.util.List<String> keywords) {}