package com.example.garderie.services;

import com.example.garderie.dto.AbsenceDTO;
import com.example.garderie.entities.*;
import com.example.garderie.exceptions.NotFoundException;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.mapper.AbsenceMapper;
import com.example.garderie.repository.AbsenceRepository;
import com.example.garderie.repository.ClasseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AbsenceService {

    // Dépendances
    private final AbsenceRepository absenceRepository;
    private final EnfantService enfantService;
    private final SeanceService seanceService;
    private final NotificationService notificationService; // <-- Ajout crucial
    private final AbsenceMapper absenceMapper;

    private final ClasseRepository classeRepository;

    @Transactional
    public Absence creerAbsence(AbsenceDTO absenceDTO) {
        try {
            // 1. Récupérer les entités liées
            Enfant enfant = enfantService.trouverParId(absenceDTO.enfantId());
            Seance seance = seanceService.getSeanceById(absenceDTO.seanceId());

            // 2. Validation de la classe
            if (!enfant.getClasse().getId().equals(seance.getClasse().getId())) {
                log.error("Validation échouée : Enfant {} n'appartient pas à la classe {}",
                        enfant.getId(), seance.getClasse().getId());
                throw new IllegalArgumentException("Classe incompatible");
            }

            // 3. Création de l'absence
            Absence absence = absenceMapper.toEntity(absenceDTO);
            absence.setEnfant(enfant);
            absence.setSeance(seance);
            Absence savedAbsence = absenceRepository.save(absence);

            // 4. Génération de la notification <-- Partie manquante
            notificationService.creerNotificationAbsence(savedAbsence);
            log.info("Notification créée pour l'absence ID {}", savedAbsence.getId());

            return savedAbsence;

        } catch (Exception e) {
            log.error("Échec de création d'absence : {}", e.getMessage());
            throw new RuntimeException("Erreur interne", e);
        }
    }
    public List<Absence> getAbsencesParClasse(Long classeId) {
        // Vérifie que la classe existe
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new NotFoundException("Classe non trouvée"));

        // Récupérer toutes les absences pour tous les enfants de cette classe
        return absenceRepository.findAllByEnfant_Classe_Id(classeId);
    }
    public List<Absence> getAbsencesParSeance(Long seanceId) {
        return absenceRepository.findBySeanceId(seanceId);
    }

    public List<Absence> getAbsencesParEnfant(Long enfantId) {
        return absenceRepository.findByEnfantId(enfantId);
    }

    @Transactional
    public Absence mettreAJourStatut(Long id, boolean justifiee) {
        Absence absence = absenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Absence non trouvée"));
        absence.setJustifiee(justifiee);
        return absenceRepository.save(absence);
    }

    @Transactional
    public void supprimerAbsence(Long id) {
        absenceRepository.deleteById(id);
    }
}