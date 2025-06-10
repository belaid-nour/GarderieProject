package com.example.garderie.services;

import com.example.garderie.entities.EmailVerificationToken;
import com.example.garderie.entities.User;
import com.example.garderie.repository.EmailVerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailVerificationService {

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    @Autowired
    private UserService userService; // Ajouter UserService

    public String createVerificationCode(User user) {
        Optional<EmailVerificationToken> existingToken =
                tokenRepository.findByUserAndExpiryDateAfter(user, LocalDateTime.now());

        if (existingToken.isPresent()) {
            return existingToken.get().getToken();
        }

        String code = String.valueOf(10000 + new Random().nextInt(90000));

        EmailVerificationToken token = new EmailVerificationToken();
        token.setToken(code);
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(1));

        tokenRepository.save(token);
        return code;
    }

    public String validateVerificationCode(String code) {
        Optional<EmailVerificationToken> tokenOptional = tokenRepository.findByToken(code);

        if (tokenOptional.isEmpty()) return "Code invalide";

        EmailVerificationToken token = tokenOptional.get();

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) return "Code expiré";

        User user = token.getUser();
        user.setEmailVerifie(true);
        tokenRepository.delete(token);

        return "Email validé avec succès";
    }

    // Modification ici : Correction de l'utilisation de userRepository et ajout de UserService
    public Optional<User> findUserByEmail(String email) {
        return userService.findByEmail(email); // Utiliser le service UserService pour trouver l'utilisateur
    }
}
