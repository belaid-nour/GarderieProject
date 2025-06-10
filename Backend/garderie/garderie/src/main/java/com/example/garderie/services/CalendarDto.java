package com.example.garderie.dto;

import java.time.LocalDateTime;

public class CalendarDto {
    private String id;
    private String title;
    private String category;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String details;

    // Constructeurs
    public CalendarDto() {}

    public CalendarDto(String id, String title, String category, LocalDateTime startDate, LocalDateTime endDate, String details) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.startDate = startDate;
        this.endDate = endDate;
        this.details = details;
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
