package com.example.garderie.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Absence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enfant_id")
    private Enfant enfant;

    @ManyToOne
    @JoinColumn(name = "seance_id")
    private Seance seance;

    private LocalDate date;
    private String raison;
    private boolean justifiee;

    @Column(nullable = false)
    private boolean present = false; // 👈 Initialisation explicite
}