package com.example.garderie.services;

import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Enfant;
import com.example.garderie.entities.User;
import com.example.garderie.repository.ClasseRepository;
import com.example.garderie.repository.EnfantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnfantService {

    private final EnfantRepository enfantRepository;
    private final ClasseRepository classeRepository;  // Injection ClasseRepository

    @Autowired
    public EnfantService(EnfantRepository enfantRepository, ClasseRepository classeRepository) {
        this.enfantRepository = enfantRepository;
        this.classeRepository = classeRepository;
    }

    public Enfant saveEnfant(Enfant enfant) {
        enfant.setConfirmed(false);
        enfant.setPaye(false);
        return enfantRepository.save(enfant);
    }

    public List<Enfant> findAllEnfants() {
        return enfantRepository.findAll();
    }

    public Optional<Enfant> findEnfantById(Long id) {
        return enfantRepository.findById(id);
    }

    public List<Enfant> findEnfantsByUser(User user) {
        return enfantRepository.findByUser(user);
    }

    public List<Enfant> findUnconfirmedEnfants() {
        return enfantRepository.findByConfirmedFalse();
    }

    @Transactional
    public Enfant confirmEnfant(Long id) {
        Enfant enfant = enfantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));
        enfant.setConfirmed(true);
        return enfantRepository.save(enfant);
    }

    @Transactional
    public Enfant markAsPaid(Long id) {
        Enfant enfant = enfantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));

        if (!enfant.isConfirmed()) {
            throw new IllegalStateException("L'enfant doit être confirmé avant le paiement");
        }

        enfant.setPaye(true);
        return enfantRepository.save(enfant);
    }

    @Transactional
    public void deleteEnfant(Long id) {
        Enfant enfant = enfantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));

        if (enfant.isPaye()) {
            throw new IllegalStateException("Impossible de supprimer un enfant déjà payé");
        }

        enfantRepository.deleteById(id);
    }

    @Transactional
    public Enfant updateEnfant(Long id, Enfant enfantDetails) {
        Enfant enfant = enfantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));

        if (enfant.isPaye()) {
            throw new IllegalStateException("Impossible de modifier un enfant déjà payé");
        }

        // Mise à jour des champs
        enfant.setNom(enfantDetails.getNom());
        enfant.setPrenom(enfantDetails.getPrenom());
        enfant.setDateNaissance(enfantDetails.getDateNaissance());
        enfant.setBus(enfantDetails.isBus());
        enfant.setClub(enfantDetails.isClub());
        enfant.setGouter(enfantDetails.isGouter());
        enfant.setTablier(enfantDetails.isTablier());
        enfant.setLivre(enfantDetails.isLivre());
        enfant.setSexe(enfantDetails.getSexe());
        enfant.setTypeInscription(enfantDetails.getTypeInscription());
        enfant.setComportementEnfant(enfantDetails.getComportementEnfant());
        enfant.setRangDansFamille(enfantDetails.getRangDansFamille());
        enfant.setNombreFrere(enfantDetails.getNombreFrere());
        enfant.setNombreSoeur(enfantDetails.getNombreSoeur());

        // Mise à jour des personnes autorisées
        enfant.setPersonneAutorisee1Nom(enfantDetails.getPersonneAutorisee1Nom());
        enfant.setPersonneAutorisee1Prenom(enfantDetails.getPersonneAutorisee1Prenom());
        enfant.setPersonneAutorisee2Nom(enfantDetails.getPersonneAutorisee2Nom());
        enfant.setPersonneAutorisee2Prenom(enfantDetails.getPersonneAutorisee2Prenom());

        // --- Si enfantDetails contient une classe associée, on la met à jour ici ---
        if (enfantDetails.getClasse() != null && enfantDetails.getClasse().getId() != null) {
            Classe classe = classeRepository.findById(enfantDetails.getClasse().getId())
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
            enfant.setClasse(classe);
        } else {
            enfant.setClasse(null);  // Retirer la classe si null dans les détails
        }

        return enfantRepository.save(enfant);
    }

    @Transactional
    public Enfant disconfirmEnfant(Long id) {
        Enfant enfant = enfantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));

        enfant.setConfirmed(false);
        return enfantRepository.save(enfant);
    }

    public Enfant trouverParId(Long id) {
        return enfantRepository.findById(id).orElseThrow();
    }

    public List<Enfant> trouverEnfantsSansClasseParNiveau(String niveau) {
        return enfantRepository.findByNiveauAndClasseIsNull(niveau);
    }

    // --- Nouvelle méthode pour assigner une classe via son ID directement ---

    @Transactional
    public Enfant assignerClasse(Long enfantId, Long classeId) {
        Enfant enfant = enfantRepository.findById(enfantId)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

        enfant.setClasse(classe);
        return enfantRepository.save(enfant);
    }

    @Transactional
    public Enfant retirerClasse(Long enfantId) {
        Enfant enfant = enfantRepository.findById(enfantId)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));
        enfant.setClasse(null);
        return enfantRepository.save(enfant);
    }

    public long countEnfants() {
        return enfantRepository.count(); // ✅ méthode existante
    }
    public Map<String, Long> countEnfantsBySexe() {
        return enfantRepository.findAll().stream()
                .collect(Collectors.groupingBy(Enfant::getSexe, Collectors.counting()));
    }
}
