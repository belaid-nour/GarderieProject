package com.example.garderie.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ignorer les propriétés Hibernate internes pour éviter les erreurs de sérialisation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enfant_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Enfant enfant;

    @Column(name = "seance_id")
    private Long seanceId;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDate date = LocalDate.now();

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    private String sentiment;
    private Double confidence;

    @ElementCollection
    @CollectionTable(name = "evaluation_themes", joinColumns = @JoinColumn(name = "evaluation_id"))
    @Column(name = "theme")
    private List<String> themes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "evaluation_suggestions", joinColumns = @JoinColumn(name = "evaluation_id"))
    @Column(name = "suggestion")
    private List<String> suggestions = new ArrayList<>();

    @Transient
    private String error;
}
