package com.example.garderie.entities;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
public class Seance {

    public enum RecurrenceType {
        AUCUNE, HEBDOMADAIRE, MENSUELLE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private LocalTime horaireDebut;
    private LocalTime horaireFin;
    private boolean obligatoire;
    private String lieu;
    private String startDate; // Date de début au format "dd/MM/yyyy"
    private String endDate;   // Date de fin au format "dd/MM/yyyy"

    @Enumerated(EnumType.STRING)
    private RecurrenceType recurrenceType;

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", referencedColumnName = "id_utilisateur")
    private User enseignant;

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public LocalTime getHoraireDebut() { return horaireDebut; }
    public void setHoraireDebut(LocalTime horaireDebut) { this.horaireDebut = horaireDebut; }
    public LocalTime getHoraireFin() { return horaireFin; }
    public void setHoraireFin(LocalTime horaireFin) { this.horaireFin = horaireFin; }
    public boolean isObligatoire() { return obligatoire; }
    public void setObligatoire(boolean obligatoire) { this.obligatoire = obligatoire; }
    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public RecurrenceType getRecurrenceType() { return recurrenceType; }
    public void setRecurrenceType(RecurrenceType recurrenceType) { this.recurrenceType = recurrenceType; }
    public Classe getClasse() { return classe; }
    public void setClasse(Classe classe) { this.classe = classe; }
    public User getEnseignant() { return enseignant; }
    public void setEnseignant(User enseignant) { this.enseignant = enseignant; }
}