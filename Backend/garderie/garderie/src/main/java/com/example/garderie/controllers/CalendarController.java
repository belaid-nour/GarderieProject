package com.example.garderie.controllers;

import com.example.garderie.dto.CalendarDto;
import com.example.garderie.services.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping
    public List<CalendarDto> getAll() {
        return calendarService.getAllEvents();
    }

    @GetMapping("/{id}")
    public CalendarDto getById(@PathVariable String id) {
        return calendarService.getEventById(id);
    }

    @PostMapping
    public CalendarDto create(@RequestBody CalendarDto dto) {
        return calendarService.createEvent(dto);
    }

    @PutMapping("/{id}")
    public CalendarDto update(@PathVariable String id, @RequestBody CalendarDto dto) {
        return calendarService.updateEvent(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        calendarService.deleteEvent(id);
    }
}
