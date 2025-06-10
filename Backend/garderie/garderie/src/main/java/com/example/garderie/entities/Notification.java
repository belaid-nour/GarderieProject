package com.example.garderie.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private LocalDateTime dateCreation;
    private boolean lue = false;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private User parent;

    @ManyToOne
    @JoinColumn(name = "absence_id")
    private Absence absence;

    @ManyToOne
    @JoinColumn(name = "avertissement_id")
    private Avertissement avertissement;

    public Notification() {
        this.dateCreation = LocalDateTime.now();
    }

    public void marquerCommeLue() {
        this.lue = true;
    }
}