package com.example.garderie.controllers;

import com.example.garderie.dto.NotificationDTO;
import com.example.garderie.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByParent(@PathVariable Long parentId) {
        List<NotificationDTO> notifications = notificationService.getNotificationsParent(parentId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/marquer-lue")
    public ResponseEntity<String> marquerCommeLue(@PathVariable Long notificationId) {
        notificationService.marquerCommeLue(notificationId);
        return ResponseEntity.ok("Notification marquée comme lue");
    }
}