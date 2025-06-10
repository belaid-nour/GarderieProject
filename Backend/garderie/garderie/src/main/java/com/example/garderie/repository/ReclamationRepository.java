package com.example.garderie.repository;

import com.example.garderie.entities.Reclamation;
import com.example.garderie.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByParent(User parent);
    List<Reclamation> findByTraite(boolean traite);
}