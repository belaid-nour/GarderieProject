package com.example.garderie.repository;

import com.example.garderie.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findByParentCin(String parentCin);
    List<Facture> findByEnfantId(Long enfantId);
    Optional<Facture> findByReferencePaiement(String referencePaiement);
    List<Facture> findByStatut(String statut);
}