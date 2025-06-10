package com.example.garderie.controllers;

import com.example.garderie.entities.User;
import com.example.garderie.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            Optional<User> existingUser = userService.findByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email already exists"));
            }

            user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
            user.setEmailVerifie(true);
            user.setCompteVerifie(true);
            User savedUser = userService.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating user: " + e.getMessage()));
        }
    }

    @PutMapping("/{userId}/activation")
    public ResponseEntity<?> updateCompteStatus(@PathVariable Long userId, @RequestParam boolean actif) {
        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setCompteVerifie(actif);
            userService.save(user);

            return ResponseEntity.ok(Map.of("message", "Account " + (actif ? "activated" : "deactivated") + " successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> user = userService.findById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error fetching user"));
        }
    }

    // 🔄 Mise à jour des infos utilisateur (sans email ni mot de passe)
    @PutMapping("/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable Long userId,
            @RequestBody User updatedUser) {

        return userService.findById(userId).map(existingUser -> {
            // Ne pas modifier l'email
            existingUser.setNom(updatedUser.getNom());
            existingUser.setPrenom(updatedUser.getPrenom());
            existingUser.setAdresse(updatedUser.getAdresse());

            // Supprimer cette ligne ↓
            // existingUser.setEmail(updatedUser.getEmail());

            // Reste du code inchangé...
            existingUser.setCin(updatedUser.getCin());
            existingUser.setNomConjoint(updatedUser.getNomConjoint());
            existingUser.setPrenomConjoint(updatedUser.getPrenomConjoint());
            existingUser.setTelephoneConjoint(updatedUser.getTelephoneConjoint());
            existingUser.setSituationParentale(updatedUser.getSituationParentale());
            existingUser.setTelephone(updatedUser.getTelephone());

            userService.save(existingUser);
            return ResponseEntity.ok("Utilisateur mis à jour avec succès.");
        }).orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé."));
    }
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching users"));
        }
    }
    @GetMapping("/teachers")
    public ResponseEntity<?> getAllTeachers() {
        try {
            System.out.println("Fetching teachers...");  // Log pour savoir si la méthode est appelée
            List<User> teachers = userService.findByRole("Teacher");
            if (teachers.isEmpty()) {
                System.out.println("No teachers found.");  // Log si aucune donnée n'est retournée
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body(Map.of("message", "No teachers found"));
            }
            System.out.println("Teachers found: " + teachers.size());  // Log pour voir combien d'enseignants sont trouvés
            return ResponseEntity.ok(teachers);
        } catch (Exception e) {
            System.out.println("Error occurred: " + e.getMessage());  // Log de l'exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching teachers"));
        }
    }

    @GetMapping("/parents")
    public ResponseEntity<?> getAllParents() {
        try {
            System.out.println("Fetching teachers...");  // Log pour savoir si la méthode est appelée
            List<User> parents= userService.findByRole("Parent");
            if (parents.isEmpty()) {
                System.out.println("No teachers found.");  // Log si aucune donnée n'est retournée
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body(Map.of("message", "No teachers found"));
            }
            System.out.println("Teachers found: " + parents.size());  // Log pour voir combien d'enseignants sont trouvés
            return ResponseEntity.ok(parents);
        } catch (Exception e) {
            System.out.println("Error occurred: " + e.getMessage());  // Log de l'exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching teachers"));
        }
    }
    @PutMapping("/{userId}/password")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> passwords) {

        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Vérifier l'ancien mot de passe
            if (!passwordEncoder.matches(passwords.get("oldPassword"), user.getMotDePasse())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Ancien mot de passe incorrect"));
            }

            // Mettre à jour le mot de passe
            user.setMotDePasse(passwordEncoder.encode(passwords.get("newPassword")));
            userService.save(user);

            return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

}