package com.example.garderie.repository;

import com.example.garderie.entities.User;
import com.example.garderie.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Vérifier si un utilisateur existe par son email
    boolean existsByEmail(String email);

    // Trouver un utilisateur par son email
    Optional<User> findByEmail(String email);

    // Trouver des utilisateurs dont le compte est validé
    List<User> findByCompteVerifie(boolean compteVerifie);

    // Trouver un utilisateur par son ID
    Optional<User> findById(Long id);

    // Trouver les utilisateurs par rôle (ajoutez cette méthode)
// Au lieu de String
    int countByRole(Role role);

    List<User> findByRole(Role role);
}
