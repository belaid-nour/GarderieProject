package com.example.garderie.repository;

import com.example.garderie.entities.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AbsenceRepository extends JpaRepository<Absence, Long> {
    List<Absence> findBySeanceId(Long seanceId);
    List<Absence> findByEnfantId(Long enfantId);
    List<Absence> findAllByEnfant_Classe_Id(Long classeId);

}