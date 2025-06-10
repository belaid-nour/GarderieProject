package com.example.garderie.services;

import com.example.garderie.entities.Enfant;
import com.example.garderie.entities.User;
import com.example.garderie.enums.Role;
import com.example.garderie.exceptions.NotFoundException;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Trouver un utilisateur par son email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Trouver un utilisateur par son ID
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    // Sauvegarder un utilisateur
    public User save(User user) {
        userRepository.save(user);
        return user;
    }
    public User trouverParId(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
    }
    // Mettre à jour le mot de passe d'un utilisateur
    public void updatePassword(Long userId, String encryptedPassword) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setMotDePasse(encryptedPassword);  // Mise à jour du mot de passe
            userRepository.save(user);
        });
    }

    // Vérifier si un utilisateur existe par son email
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Vérifier si un utilisateur est validé par le compte
    public boolean isAccountVerified(Long userId) {
        return userRepository.findById(userId)
                .map(User::isCompteVerifie)
                .orElse(false);
    }

    // Récupérer tous les utilisateurs
    public List<User> findAll() {
        return userRepository.findAll();
    }
    // Add this method to find users by role
    public List<User> findByRole(String role) {
        try {
            Role roleEnum = Role.valueOf(role); // throws if role is invalid
            return userRepository.findByRole(Role.valueOf(String.valueOf(roleEnum)));
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid role: " + role);
            throw new RuntimeException("Invalid role: " + role);
        }
    }


}




