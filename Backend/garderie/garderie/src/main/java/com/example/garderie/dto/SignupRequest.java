package com.example.garderie.dto;

import com.example.garderie.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    private String adresse;

    @NotBlank(message = "Le CIN est obligatoire")
    @Pattern(regexp = "\\d{8}", message = "Le CIN doit contenir exactement 8 chiffres")
    private String cin;

    private String nomConjoint;
    private String prenomConjoint;
    private String telephoneConjoint;
    private String situationParentale;

    @NotNull(message = "Le rôle est obligatoire")
    private Role role;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "\\d{8}", message = "Le téléphone doit contenir exactement 8 chiffres")
    private String telephone;
}
