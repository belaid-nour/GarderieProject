package com.example.garderie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String fileUrl;
    private LocalDateTime uploadDate;
    private Long classeId;
    private Long teacherId;
    private String teacherName;
}