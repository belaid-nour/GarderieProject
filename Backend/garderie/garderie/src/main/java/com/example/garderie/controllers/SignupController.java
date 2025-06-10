package com.example.garderie.controllers;

import com.example.garderie.dto.SignupRequest;
import com.example.garderie.entities.User;
import com.example.garderie.services.AuthService;
import com.example.garderie.services.EmailService;
import com.example.garderie.services.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/signup")
@RequiredArgsConstructor // Lombok génère le constructeur avec tous les champs `final`
public class SignupController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<?> signupUser(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            User createdUser = authService.createUser(signupRequest);

            String code = emailVerificationService.createVerificationCode(createdUser);

            emailService.sendVerificationEmail(createdUser.getEmail(), code);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new SignupResponse("Utilisateur enregistré avec succès. Veuillez vérifier votre email.", createdUser)
            );
        } catch (RuntimeException e) {
            String errorMessage = e.getMessage();
            if (errorMessage.contains("Email already exists")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        new SignupResponse("Email déjà utilisé", null)
                );
            } else if (errorMessage.contains("cannot be null")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        new SignupResponse("Champ requis manquant : " + errorMessage, null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                        new SignupResponse("Échec de la création de l'utilisateur : " + errorMessage, null)
                );
            }
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // ✅ Classe interne avec Lombok
    @Data
    @AllArgsConstructor
    private static class SignupResponse {
        private String message;
        private User user;
    }
}
