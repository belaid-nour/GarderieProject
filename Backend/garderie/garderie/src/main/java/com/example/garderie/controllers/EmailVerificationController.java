package com.example.garderie.controllers;

import com.example.garderie.entities.User;
import com.example.garderie.services.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @GetMapping("/validate-code")
    public ResponseEntity<Map<String, String>> validateEmail(@RequestParam("code") String code) {
        String validationResult = emailVerificationService.validateVerificationCode(code);

        Map<String, String> response = new HashMap<>();
        response.put("message", validationResult);

        if ("Email validé avec succès".equals(validationResult)) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else if ("Code expiré".equals(validationResult)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/resend-code")
    public ResponseEntity<Map<String, String>> resendCode(@RequestParam("email") String email) {
        Optional<User> userOptional = emailVerificationService.findUserByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Utilisateur non trouvé"));
        }

        User user = userOptional.get();
        String newCode = emailVerificationService.createVerificationCode(user);

        return ResponseEntity.ok(Map.of(
                "message", "Nouveau code envoyé",
                "code", newCode // ⚠️ à ne pas inclure en prod
        ));
    }
}
