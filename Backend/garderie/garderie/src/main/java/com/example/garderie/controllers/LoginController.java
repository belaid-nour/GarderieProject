package com.example.garderie.controllers;

import com.example.garderie.dto.ErrorResponse;
import com.example.garderie.dto.LoginRequest;
import com.example.garderie.dto.LoginResponse;
import com.example.garderie.entities.User;
import com.example.garderie.services.UserService;
import com.example.garderie.services.jwt.UserServiceImpl;
import com.example.garderie.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl userServiceImpl;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Vérifier si l'email existe
            User user = userService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("INVALID_EMAIL"));

            // 2. Vérifier si l'email est vérifié
            if (!user.isEmailVerifie()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("EMAIL_NOT_VERIFIED",
                                "Veuillez valider votre email avant de vous connecter"));
            }

            // 3. Vérifier si le compte est activé par l'admin
            if (!user.isCompteVerifie()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("ACCOUNT_NOT_VERIFIED",
                                "Votre compte est désactivé par l'administration"));
            }

            // 4. Authentification
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getMotDePasse()
                    )
            );

            // 5. Génération du JWT
            final UserDetails userDetails = userServiceImpl.loadUserByUsername(loginRequest.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails.getUsername());

            // 6. Répondre avec toutes les infos nécessaires
            LoginResponse response = new LoginResponse(
                    jwt,
                    user.getRole().name(),
                    user.getNom(),
                    user.getPrenom(),
                    user.getEmail(),
                    user.getId_utilisateur()
            );

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            String errorCode = "INVALID_CREDENTIALS";
            String message = "Email ou mot de passe incorrect";

            if ("INVALID_EMAIL".equals(e.getMessage())) {
                errorCode = "INVALID_EMAIL";
                message = "Cet email n'est pas enregistré dans notre système";
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(errorCode, message));
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("ACCOUNT_DISABLED", "Votre compte est désactivé"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("LOGIN_ERROR", "Erreur lors de l'authentification"));
        }
    }
}