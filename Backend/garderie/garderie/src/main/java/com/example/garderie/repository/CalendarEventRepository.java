package com.example.garderie.repository;

import com.example.garderie.entities.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, String> {}
