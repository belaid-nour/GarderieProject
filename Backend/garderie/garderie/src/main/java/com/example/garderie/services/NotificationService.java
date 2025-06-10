package com.example.garderie.services;

import com.example.garderie.dto.NotificationDTO;
import com.example.garderie.entities.*;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.mapper.NotificationMapper;
import com.example.garderie.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserService userService;

    // Méthode pour les absences
    public void creerNotificationAbsence(Absence absence) {
        if (absence == null || absence.getEnfant() == null) {
            throw new IllegalArgumentException("Absence ou enfant invalide.");
        }

        Enfant enfant = absence.getEnfant();
        User parent = enfant.getUser();

        if (parent != null) {
            Notification notification = new Notification();
            notification.setMessage("Absence de " + enfant.getPrenom() + " le " + absence.getDate());
            notification.setParent(parent);
            notification.setAbsence(absence);
            notification.setLue(false);
            notificationRepository.save(notification);
        }
    }

    // Nouvelle méthode pour les avertissements
    public void creerNotificationAvertissement(Avertissement avertissement) {
        if (avertissement == null || avertissement.getEnfant() == null) {
            throw new IllegalArgumentException("Avertissement ou enfant invalide.");
        }

        Enfant enfant = avertissement.getEnfant();
        User parent = enfant.getUser();

        if (parent != null) {
            Notification notification = new Notification();
            notification.setMessage("Nouvel avertissement pour " + enfant.getPrenom() +
                    ": " + avertissement.getTitre() +
                    " (Sévérité: " + avertissement.getSeverite() + ")");
            notification.setParent(parent);
            notification.setAvertissement(avertissement);
            notification.setLue(false);
            notificationRepository.save(notification);
        }
    }

    public List<NotificationDTO> getNotificationsParent(Long parentId) {
        User parent = userService.trouverParId(parentId);

        return notificationRepository.findByParent(parent)
                .stream()
                .map(notificationMapper::toDto)
                .toList();
    }

    public void marquerCommeLue(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée"));
        notification.setLue(true);
        notificationRepository.save(notification);
    }
}