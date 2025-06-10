package com.example.garderie.repository;

import com.example.garderie.entities.Notification;
import com.example.garderie.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByParentOrderByDateCreationDesc(User parent);
    List<Notification> findByParentAndLueFalse(User parent);
    List<Notification> findByParent(User parent);

}