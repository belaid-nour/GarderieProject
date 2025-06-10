package com.example.garderie.controllers;

import com.example.garderie.dto.EnfantDTO;
import com.example.garderie.entities.Enfant;
import com.example.garderie.entities.User;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.services.EnfantService;
import com.example.garderie.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enfants")
public class EnfantController {

    private final EnfantService enfantService;
    private final UserService userService;

    public EnfantController(EnfantService enfantService, UserService userService) {
        this.enfantService = enfantService;
        this.userService = userService;
    }

    // Conversion Entité -> DTO
    private EnfantDTO convertToDTO(Enfant enfant) {
        return EnfantDTO.builder()
                .id(enfant.getId())
                .nom(enfant.getNom())
                .prenom(enfant.getPrenom())
                .niveau(enfant.getNiveau())
                .bus(enfant.isBus())
                .club(enfant.isClub())
                .gouter(enfant.isGouter())
                .tablier(enfant.isTablier())
                .livre(enfant.isLivre())
                .sexe(enfant.getSexe())
                .classeId(enfant.getClasse() != null ? enfant.getClasse().getId() : null)
                .build();
    }

    @PostMapping
    public EnfantDTO ajouterEnfant(@RequestBody EnfantDTO enfantDTO, Principal principal) {
        Enfant enfant = new Enfant();
        // Copie des propriétés du DTO vers l'entité
        enfant.setNom(enfantDTO.getNom());
        enfant.setPrenom(enfantDTO.getPrenom());
        enfant.setDateNaissance(java.sql.Date.valueOf(enfantDTO.getDateNaissance()));
        enfant.setNiveau(enfantDTO.getNiveau());
        enfant.setBus(enfantDTO.isBus());
        enfant.setClub(enfantDTO.isClub());
        enfant.setGouter(enfantDTO.isGouter());
        enfant.setTablier(enfantDTO.isTablier());
        enfant.setLivre(enfantDTO.isLivre());
        enfant.setSexe(enfantDTO.getSexe());

        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        enfant.setUser(user);
        enfant.setConfirmed(false);
        enfant.setPaye(false);

        return convertToDTO(enfantService.saveEnfant(enfant));
    }

    @GetMapping
    public List<EnfantDTO> getAllEnfants() {
        return enfantService.findAllEnfants().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public EnfantDTO getEnfantById(@PathVariable Long id) {
        return convertToDTO(enfantService.findEnfantById(id)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé")));
    }

    @GetMapping("/mes-enfants")
    public List<EnfantDTO> getMesEnfants(Principal principal) {
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return enfantService.findEnfantsByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public EnfantDTO updateEnfant(@PathVariable Long id, @RequestBody EnfantDTO enfantDTO) {
        Enfant enfantDetails = new Enfant();
        // Mise à jour des propriétés
        enfantDetails.setNom(enfantDTO.getNom());
        enfantDetails.setPrenom(enfantDTO.getPrenom());
        // ... autres propriétés

        return convertToDTO(enfantService.updateEnfant(id, enfantDetails));
    }

    @DeleteMapping("/{id}")
    public void deleteEnfant(@PathVariable Long id, Principal principal) {
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Enfant existingEnfant = enfantService.findEnfantById(id)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));

        if (!existingEnfant.getUser().getId_utilisateur().equals(user.getId_utilisateur())) {
            throw new RuntimeException("Action non autorisée");
        }

        enfantService.deleteEnfant(id);
    }

    @GetMapping("/{enfantId}/parent")
    public ResponseEntity<Long> getParentIdByEnfantId(@PathVariable Long enfantId) {
        Enfant enfant = enfantService.findEnfantById(enfantId)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));

        return ResponseEntity.ok(enfant.getUser().getId_utilisateur());
    }

    @GetMapping("/a-confirmer")
    public List<EnfantDTO> getEnfantsAConfirmer() {
        return enfantService.findUnconfirmedEnfants().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/confirmer/{id}")
    public EnfantDTO confirmerEnfant(@PathVariable Long id) {
        return convertToDTO(enfantService.confirmEnfant(id));
    }

    @PostMapping("/payer/{id}")
    public EnfantDTO marquerCommePaye(@PathVariable Long id) {
        return convertToDTO(enfantService.markAsPaid(id));
    }

    @PostMapping("/disconfirmer/{id}")
    public EnfantDTO disconfirmerEnfant(@PathVariable Long id) {
        return convertToDTO(enfantService.disconfirmEnfant(id));
    }

    @GetMapping("/{enfantId}/classe")
    public ResponseEntity<?> getClasseByEnfantId(@PathVariable Long enfantId) {
        try {
            Enfant enfant = enfantService.findEnfantById(enfantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Enfant non trouvé"));

            if (enfant.getClasse() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune classe assignée");
            }

            return ResponseEntity.ok(enfant.getClasse().getId()); // Retourne seulement l'ID
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}