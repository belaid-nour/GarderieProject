package com.example.garderie.repository;

import com.example.garderie.entities.Avertissement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AvertissementRepository extends JpaRepository<Avertissement, Long> {

    @Query("SELECT a FROM Avertissement a WHERE a.enseignant.id_utilisateur = :enseignantId")
    List<Avertissement> findAllByEnseignantId(@Param("enseignantId") Long enseignantId);

    @Query("SELECT a FROM Avertissement a WHERE a.enfant.id = :enfantId")
    List<Avertissement> findAllByEnfantId(@Param("enfantId") Long enfantId);

    @Query("SELECT a FROM Avertissement a WHERE a.enfant.classe.id = :classeId")
    List<Avertissement> findByClasseId(@Param("classeId") Long classeId);
}