package com.example.garderie.repository;

import com.example.garderie.entities.EmailVerificationToken;
import com.example.garderie.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    // Recherche par token (code)
    Optional<EmailVerificationToken> findByToken(String token);

    // Recherche par utilisateur et date d'expiration
    Optional<EmailVerificationToken> findByUserAndExpiryDateAfter(User user, LocalDateTime currentDate);
}
