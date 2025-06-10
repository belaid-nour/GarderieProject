package com.example.garderie.entities;

import com.example.garderie.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Long id_utilisateur;

    private String nom;
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    private String adresse;
    private String cin;
    private String nomConjoint;
    private String prenomConjoint;
    private String telephoneConjoint;
    private String situationParentale;
    private String telephone;

    private boolean emailVerifie;
    private boolean compteVerifie = true;
}

