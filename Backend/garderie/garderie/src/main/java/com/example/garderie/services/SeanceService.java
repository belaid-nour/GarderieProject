package com.example.garderie.services;

import com.example.garderie.dto.SeanceDTO;
import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Seance;
import com.example.garderie.entities.User;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.repository.ClasseRepository;
import com.example.garderie.repository.SeanceRepository;
import com.example.garderie.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SeanceService {

    private final SeanceRepository seanceRepository;
    private final ClasseRepository classeRepository;
    private final UserRepository userRepository;

    public SeanceService(SeanceRepository seanceRepository,
                         ClasseRepository classeRepository,
                         UserRepository userRepository) {
        this.seanceRepository = seanceRepository;
        this.classeRepository = classeRepository;
        this.userRepository = userRepository;
    }

    public Seance createSeance(SeanceDTO seanceDTO, Long classeId, Long enseignantId) {
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée"));
        User enseignant = userRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé"));

        Seance seance = new Seance();
        seance.setNom(seanceDTO.nom());
        seance.setHoraireDebut(seanceDTO.horaireDebut());
        seance.setHoraireFin(seanceDTO.horaireFin());
        seance.setObligatoire(seanceDTO.obligatoire());
        seance.setLieu(seanceDTO.lieu());
        // Nouvelle initialisation
        seance.setStartDate(seanceDTO.startDate());
        seance.setEndDate(seanceDTO.endDate());
        seance.setRecurrenceType(seanceDTO.recurrenceType());
        seance.setClasse(classe);
        seance.setEnseignant(enseignant);

        return seanceRepository.save(seance);
    }

    public List<Seance> getAllSeances() {
        return seanceRepository.findAll();
    }

    public Seance updateSeance(Long id, Seance seanceDetails) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Séance non trouvée"));

        seance.setNom(seanceDetails.getNom());
        seance.setHoraireDebut(seanceDetails.getHoraireDebut());
        seance.setHoraireFin(seanceDetails.getHoraireFin());
        seance.setObligatoire(seanceDetails.isObligatoire());
        seance.setLieu(seanceDetails.getLieu());
        // Nouvelle initialisation

        return seanceRepository.save(seance);
    }

    public void deleteSeance(Long id) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Séance non trouvée"));
        seanceRepository.delete(seance);
    }
    public Seance getSeanceById(Long id) {
        return seanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Séance non trouvée"));
    }
    public List<Seance> getSeancesByClasse(Long classeId) {
        return seanceRepository.findByClasseId(classeId);
    }

    public List<Seance> getSeancesByEnseignant(Long enseignantId) {
        return seanceRepository.findByEnseignantId(enseignantId);
    }

    public List<Seance> findSeancesByClassIds(List<Long> classIds) {
        return seanceRepository.findByClasseIdIn(classIds);
    }
}