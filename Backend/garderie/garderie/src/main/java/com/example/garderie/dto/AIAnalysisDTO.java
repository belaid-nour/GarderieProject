package com.example.garderie.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AIAnalysisDTO {
    @JsonProperty("sentiment")
    private String sentiment;

    @JsonProperty("confidence")
    private Double confidence;

    @JsonProperty("themes")
    private List<String> themes;

    @JsonProperty("suggestions")
    private List<String> suggestions;

    private String error;

    public static AIAnalysisDTO createDefault() {
        return AIAnalysisDTO.builder()
                .sentiment("NEUTRE")
                .confidence(0.5)
                .suggestions(List.of("Service indisponible"))
                .build();
    }
}
