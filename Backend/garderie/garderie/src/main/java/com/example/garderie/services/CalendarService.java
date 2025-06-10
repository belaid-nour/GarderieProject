package com.example.garderie.services;

import com.example.garderie.dto.CalendarDto;
import com.example.garderie.entities.CalendarEvent;
import com.example.garderie.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    @Autowired
    private CalendarEventRepository repository;

    public List<CalendarDto> getAllEvents() {
        return repository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CalendarDto getEventById(String id) {
        return repository.findById(id).map(this::convertToDto).orElse(null);
    }

    public CalendarDto createEvent(CalendarDto dto) {
        CalendarEvent event = convertToEntity(dto);
        repository.save(event);
        return convertToDto(event);
    }

    public CalendarDto updateEvent(String id, CalendarDto dto) {
        Optional<CalendarEvent> optionalEvent = repository.findById(id);
        if (optionalEvent.isPresent()) {
            CalendarEvent event = convertToEntity(dto);
            return convertToDto(repository.save(event));
        }
        return null;
    }

    public void deleteEvent(String id) {
        repository.deleteById(id);
    }

    private CalendarDto convertToDto(CalendarEvent e) {
        return new CalendarDto(e.getId(), e.getTitle(), e.getCategory(), e.getStartDate(), e.getEndDate(), e.getDetails());
    }

    private CalendarEvent convertToEntity(CalendarDto d) {
        CalendarEvent e = new CalendarEvent();
        e.setId(d.getId());
        e.setTitle(d.getTitle());
        e.setCategory(d.getCategory());
        e.setStartDate(d.getStartDate());
        e.setEndDate(d.getEndDate());
        e.setDetails(d.getDetails());
        return e;
    }
}
