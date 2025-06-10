package com.example.garderie.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom; // Ex: "Moyenne Section A"

    private String niveau; // Doit correspondre au niveau des enfants

    private String annee; // Nouvelle propriété pour l'année

    private int effectifMax; // Nouvelle propriété pour le nombre maximum d'enfants

    @OneToMany(mappedBy = "classe", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("classe")
    @JsonManagedReference
    private List<Enfant> enfants = new ArrayList<>();

    public void ajouterEnfant(Enfant enfant) {
        enfants.add(enfant);
        enfant.setClasse(this);
    }

    public void retirerEnfant(Enfant enfant) {
        enfants.remove(enfant);
        enfant.setClasse(null);
    }
}
