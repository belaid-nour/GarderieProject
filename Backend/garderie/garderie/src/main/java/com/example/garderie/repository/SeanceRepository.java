package com.example.garderie.repository;

import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Seance;
import com.example.garderie.entities.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SeanceRepository extends JpaRepository<Seance, Long> {

    // Remplacer 'date' par 'startDate'
    List<Seance> findByStartDateAndClasseId(String startDate, Long classeId);

    // Conserver les autres méthodes
    List<Seance> findByClasseIdIn(List<Long> classIds);

    @Query("SELECT s FROM Seance s WHERE s.enseignant.id_utilisateur = :enseignantId")
    List<Seance> findByEnseignantId(@Param("enseignantId") Long enseignantId);

    List<Seance> findByClasseId(Long classeId);
    List<Seance> findByObligatoire(boolean obligatoire);

    @Query("SELECT s FROM Seance s WHERE s.classe.id = :classeId " +
            "AND s.startDate <= :endDate " +
            "AND s.endDate >= :startDate")
    List<Seance> findByClasseAndDateRange(
            @Param("classeId") Long classeId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);



    @Query("SELECT s FROM Seance s " +
            "JOIN FETCH s.classe c " +
            "JOIN FETCH c.enfants " +
            "WHERE s.enseignant.id_utilisateur = :enseignantId")
    List<Seance> findByEnseignantIdWithClasseAndEnfants(@Param("enseignantId") Long enseignantId);



    @Query("SELECT s FROM Seance s JOIN FETCH s.classe WHERE s.enseignant.id_utilisateur = :enseignantId")
    List<Seance> findByEnseignantIdWithClasse(@Param("enseignantId") Long enseignantId);

    boolean existsByClasseAndEnseignant(Classe classe, User enseignant);
}