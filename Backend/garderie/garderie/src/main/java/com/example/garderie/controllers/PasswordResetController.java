package com.example.garderie.controllers;

import com.example.garderie.entities.User;
import com.example.garderie.services.EmailService;
import com.example.garderie.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/auth/password")
public class PasswordResetController {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetController.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public PasswordResetController(UserService userService,
                                   PasswordEncoder passwordEncoder,
                                   EmailService emailService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /**
     * Méthode pour réinitialiser le mot de passe.
     * Elle attend un email dans le corps de la requête pour rechercher l'utilisateur,
     * générer un nouveau mot de passe et l'envoyer à l'utilisateur par email.
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        try {
            log.info("Demande de réinitialisation pour l'email: {}", email);

            // Vérifier si l'email est fourni
            if (email == null || email.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'email est requis");
            }

            // Trouver l'utilisateur par son email
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));

            // Générer un nouveau mot de passe sécurisé
            String newPassword = emailService.generateSecurePassword();

            // Mettre à jour le mot de passe de l'utilisateur
            userService.updatePassword(user.getId_utilisateur(), passwordEncoder.encode(newPassword));

            // Envoyer le nouveau mot de passe à l'utilisateur par email
            emailService.sendNewPasswordEmail(user.getEmail(), newPassword);

            // Retourner une réponse réussie
            return ResponseEntity.ok(Map.of(
                    "message", "Un nouveau mot de passe a été envoyé à votre adresse email",
                    "status", "success"
            ));

        } catch (ResponseStatusException e) {
            throw e; // Re-throw les exceptions spécifiques de Spring
        } catch (Exception e) {
            log.error("Erreur lors de la réinitialisation du mot de passe", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Une erreur est survenue lors de la réinitialisation");
        }
    }
}
