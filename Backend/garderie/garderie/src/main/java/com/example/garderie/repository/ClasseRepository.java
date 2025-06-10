package com.example.garderie.repository;

import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Enfant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClasseRepository extends JpaRepository<Classe, Long> {
    boolean existsByNom(String nom);
    List<Classe> findByNiveau(String niveau);
    boolean existsById(Long id);


}