package com.example.garderie.repository;

import com.example.garderie.entities.Enfant;
import com.example.garderie.entities.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnfantRepository extends JpaRepository<Enfant, Long> {

    List<Enfant> findByUser(User user);

    List<Enfant> findByConfirmedFalse();

    List<Enfant> findByConfirmedTrueAndPayeFalse();

    List<Enfant> findByPayeTrue();

    boolean existsByIdAndUser(Long id, User user);

    long countByConfirmedFalse();
    List<Enfant> findByNiveauAndClasseIsNull(String niveau);
    @Query("SELECT e FROM Enfant e WHERE e.classe.id = :classeId")
    List<Enfant> findByClasseId(@Param("classeId") Long classeId);

    @EntityGraph(attributePaths = {"classe", "classe.seances"})
    Optional<Enfant> findWithClasseAndSeancesById(Long id);



    // ✅ Compte le nombre total d’enfants
    long count();

    // ✅ Compte les enfants par utilisateur
    long countByUser(User user);

    // ✅ Compte les enfants confirmés
    long countByConfirmedTrue();

    // ✅ Compte les enfants non payés
    long countByPayeFalse();

    // ✅ Compte les enfants par niveau
    long countByNiveau(String niveau);

    // ✅ Compte les enfants confirmés et non payés
    long countByConfirmedTrueAndPayeFalse();
    long countByClasseId(Long classeId);


}
