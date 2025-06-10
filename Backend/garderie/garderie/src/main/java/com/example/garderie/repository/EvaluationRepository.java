package com.example.garderie.repository;

import com.example.garderie.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    // Requête corrigée avec jointure explicite
    @Query("SELECT e FROM Evaluation e WHERE e.enfant.id = :enfantId ORDER BY e.date DESC")
    List<Evaluation> findByEnfantIdOrderByDateDesc(@Param("enfantId") Long enfantId);

    // Requête corrigée avec jointure
    @Query("SELECT e FROM Evaluation e WHERE e.seanceId = :seanceId ORDER BY e.enfant.nom ASC")
    List<Evaluation> findBySeanceIdOrderByEnfantNomAsc(@Param("seanceId") Long seanceId);

    // Requête pour la classe
    @Query("SELECT e FROM Evaluation e WHERE e.enfant.classe.id = :classeId ORDER BY e.date DESC")
    List<Evaluation> findByEnfantClasseIdOrderByDateDesc(@Param("classeId") Long classeId);
}