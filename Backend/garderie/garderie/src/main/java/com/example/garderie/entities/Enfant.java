package com.example.garderie.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enfant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;


    @Temporal(TemporalType.DATE)
    private Date dateNaissance;

    // Nouveau champ classe
    @Column(nullable = false, length = 50) // Augmentez à 50 caractères
    private String niveau;

    private boolean bus;
    private boolean club;
    private boolean gouter;
    private boolean tablier;
    private boolean livre;
    private String sexe;
    private int age;
    private float total;

    @Column(name = "type_inscription")
    private String typeInscription;

    @Column(name = "comportement_enfant")
    private String comportementEnfant;

    private int rangDansFamille;
    private int nombreFrere;
    private int nombreSoeur;

    private boolean confirmed = false;
    private boolean paye = false;

    // Personnes autorisées
    private String personneAutorisee1Nom;
    private String personneAutorisee1Prenom;
    private String personneAutorisee2Nom;
    private String personneAutorisee2Prenom;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private User user;

    // Nouveau champ description
    @Column(length = 500)  // Ajoutez une taille si vous souhaitez limiter la longueur
    private String description;
    @ManyToOne
    @JoinColumn(name = "classe_id")

    @JsonBackReference
    private Classe classe;

}
