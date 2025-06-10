package com.example.garderie.services;

import com.example.garderie.dto.AvertissementDTO;
import com.example.garderie.dto.AvertissementResponseDTO;
import com.example.garderie.entities.*;
import com.example.garderie.exceptions.NotFoundException;
import com.example.garderie.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AvertissementService {

    private final AvertissementRepository avertissementRepository;
    private final UserRepository userRepository;
    private final EnfantRepository enfantRepository;
    private final SeanceRepository seanceRepository;
    private final NotificationService notificationService;

    @Transactional
    public Avertissement creerAvertissement(AvertissementDTO dto) {
        User enseignant = userRepository.findById(dto.getEnseignantId())
                .orElseThrow(() -> new NotFoundException("Enseignant non trouvé"));

        Enfant enfant = enfantRepository.findById(dto.getEnfantId())
                .orElseThrow(() -> new NotFoundException("Enfant non trouvé"));

        verifyTeacherAuthorization(enseignant, enfant);

        Avertissement avertissement = saveAvertissement(dto, enseignant, enfant);

        // Création de la notification APRÈS sauvegarde pour respecter la FK
        notificationService.creerNotificationAvertissement(avertissement);

        return avertissement;
    }

    private void verifyTeacherAuthorization(User enseignant, Enfant enfant) {
        boolean isAuthorized = seanceRepository.existsByClasseAndEnseignant(
                enfant.getClasse(),
                enseignant
        );

        if (!isAuthorized) {
            throw new SecurityException("Autorisation refusée");
        }
    }

    private Avertissement saveAvertissement(AvertissementDTO dto, User enseignant, Enfant enfant) {
        Avertissement avertissement = new Avertissement();
        avertissement.setTitre(dto.getTitre());
        avertissement.setDescription(dto.getDescription());
        avertissement.setSeverite(dto.getSeverite());
        avertissement.setEnseignant(enseignant);
        avertissement.setEnfant(enfant);
        avertissement.setDateCreation(LocalDateTime.now());

        return avertissementRepository.save(avertissement);
    }

    public List<Avertissement> getByEnseignant(Long enseignantId) {
        return avertissementRepository.findAllByEnseignantId(enseignantId);
    }

    public List<Avertissement> getByEnfant(Long enfantId) {
        return avertissementRepository.findAllByEnfantId(enfantId);
    }

    public Map<Classe, List<Enfant>> getClassesEtElevesParEnseignant(Long enseignantId) {
        List<Seance> seances = seanceRepository.findByEnseignantIdWithClasseAndEnfants(enseignantId);

        Map<Classe, List<Enfant>> result = new HashMap<>();

        seances.forEach(seance -> {
            Classe classe = seance.getClasse();
            List<Enfant> enfants = classe.getEnfants();

            if (result.containsKey(classe)) {
                List<Enfant> existants = result.get(classe);
                enfants.stream()
                        .filter(e -> !existants.contains(e))
                        .forEach(existants::add);
            } else {
                result.put(classe, new ArrayList<>(enfants));
            }
        });

        return result;
    }

    public AvertissementResponseDTO getById(Long id) {
        Avertissement avertissement = avertissementRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Avertissement non trouvé avec l'id: " + id));

        return AvertissementResponseDTO.fromEntity(avertissement);
    }
    public List<Avertissement> getAll() {
        return avertissementRepository.findAll();
    }

}
