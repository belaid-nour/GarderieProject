package com.example.garderie.services;

import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Enfant;
import com.example.garderie.entities.Seance;
import com.example.garderie.exceptions.DuplicateClasseException;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.repository.ClasseRepository;
import com.example.garderie.repository.SeanceRepository;

import com.example.garderie.repository.EnfantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClasseService {

    private final ClasseRepository classeRepository;
    private final EnfantService enfantService;
    private final SeanceRepository seanceRepository;
    private final EnfantRepository enfantRepository; // Inject EnfantRepository


    public Classe creerClasse(Classe classe) throws DuplicateClasseException {
        if(classeRepository.existsByNom(classe.getNom())) {
            throw new DuplicateClasseException("Le nom de classe existe déjà");
        }
        return classeRepository.save(classe);
    }

    public Classe trouverClasseParId(Long id) {
        return classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée"));
    }

    public List<Classe> classesParNiveau(String niveau) {
        return classeRepository.findByNiveau(niveau);
    }

    public void assignerEnfant(Long classeId, Long enfantId) {
        Classe classe = this.trouverClasseParId(classeId);
        Enfant enfant = enfantService.trouverParId(enfantId);

        if(!enfant.getNiveau().equals(classe.getNiveau())) {
            throw new IllegalArgumentException("Niveau incompatible");
        }

        if(classe.getEnfants().size() >= classe.getEffectifMax()) {
            throw new IllegalArgumentException("Le nombre d'enfants maximum a été atteint");
        }

        enfant.setClasse(classe);
        enfantService.saveEnfant(enfant);
    }

    public List<Enfant> enfantsNonAssignes(String niveau) {
        return enfantService.trouverEnfantsSansClasseParNiveau(niveau);
    }
    public Classe getClasseById(Long classeId) {
        return classeRepository.findById(classeId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable"));
    }
    public List<Classe> getAllClasses() {
        return classeRepository.findAll();
    }

    public void supprimerClasse(Long id) {
        if(!classeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Classe introuvable");
        }
        classeRepository.deleteById(id);
    }
    // ClasseService.java
    public List<Classe> getClassesByTeacher(Long teacherId) {
        // Récupérer toutes les séances de l'enseignant
        List<Seance> seances = seanceRepository.findByEnseignantId(teacherId);

        // Extraire les classes uniques
        return seances.stream()
                .map(Seance::getClasse)
                .distinct()
                .collect(Collectors.toList());
    }
    public List<Enfant> trouverEnfantsParClasseId(Long classeId) {
        if (!classeRepository.existsById(classeId)) {
            throw new ResourceNotFoundException("Classe introuvable");
        }
        return enfantRepository.findByClasseId(classeId); // Use injected repository
    }

    public Map<String, Long> getNombreClassesParNiveau() {
        return classeRepository.findAll().stream()
                .collect(Collectors.groupingBy(Classe::getNiveau, Collectors.counting()));
    }
    // Exemple de retour : { "Niveau1": { "ClasseA": 15, "ClasseB": 12 }, "Niveau2": { ... } }

    public Map<String, Map<String, Integer>> getNombreEnfantsParClasseParNiveau() {
        List<Classe> classes = classeRepository.findAll();
        Map<String, Map<String, Integer>> result = new HashMap<>();

        for (Classe classe : classes) {
            String niveau = classe.getNiveau() != null ? classe.getNiveau() : "Inconnu";
            String nomClasse = classe.getNom() != null ? classe.getNom() : "SansNom";

            // Assure que le niveau existe dans la map principale
            result.computeIfAbsent(niveau, k -> new HashMap<>());

            // Compte le nombre d'enfants par classe
            int nombreEnfants = (int) enfantRepository.countByClasseId(classe.getId());

            // Ajoute le résultat dans la map
            result.get(niveau).put(nomClasse, nombreEnfants);
        }

        return result;
    }

}


