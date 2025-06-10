package com.example.garderie.services;

import com.example.garderie.dto.CourseDTO;
import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Course;
import com.example.garderie.entities.User;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final ClasseService classeService;
    private final Path fileStorageLocation = Paths.get("uploads/courses").toAbsolutePath().normalize();

    public Course uploadCourse(MultipartFile file, CourseDTO courseDTO, User teacher) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("Le fichier est vide");
        Files.createDirectories(fileStorageLocation);

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename().replace(" ", "_");
        Files.copy(file.getInputStream(), fileStorageLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        Classe classe = classeService.getClasseById(courseDTO.getClasseId());

        return courseRepository.save(Course.builder()
                .title(courseDTO.getTitle())
                .description(courseDTO.getDescription())
                .fileName(fileName)
                .uploadDate(LocalDateTime.now())
                .teacher(teacher)
                .classe(classe)
                .build());
    }

    public ResponseEntity<Resource> downloadCourse(Long id) throws Exception {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable"));

        Path filePath = fileStorageLocation.resolve(course.getFileName());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new ResourceNotFoundException("Fichier non trouvé");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    public List<CourseDTO> getCoursesByClasse(Long classeId) {
        return courseRepository.findByClasseId(classeId).stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<CourseDTO> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream()
                .map(this::convertToDTO)
                .toList();
    }

    public void deleteCourse(Long id) throws IOException {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable"));

        // Suppression du fichier physique
        Path filePath = fileStorageLocation.resolve(course.getFileName());
        Files.deleteIfExists(filePath);

        // Suppression de la base de données
        courseRepository.delete(course);
    }

    public Course updateCourse(Long id, CourseDTO courseDTO, MultipartFile file) throws IOException {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable"));

        // Mise à jour du titre et description
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());

        // Mise à jour de la classe
        Classe classe = classeService.getClasseById(courseDTO.getClasseId());
        course.setClasse(classe);

        // Si nouveau fichier fourni, on remplace l'ancien
        if (file != null && !file.isEmpty()) {
            // Supprimer l'ancien fichier
            Path oldFilePath = fileStorageLocation.resolve(course.getFileName());
            Files.deleteIfExists(oldFilePath);

            // Enregistrer le nouveau fichier
            String newFileName = UUID.randomUUID() + "_" + file.getOriginalFilename().replace(" ", "_");
            Files.copy(file.getInputStream(), fileStorageLocation.resolve(newFileName), StandardCopyOption.REPLACE_EXISTING);
            course.setFileName(newFileName);

            // Mettre à jour la date d'upload
            course.setUploadDate(LocalDateTime.now());
        }

        return courseRepository.save(course);
    }

    private CourseDTO convertToDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .fileUrl(ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/courses/download/")
                        .path(course.getId().toString())
                        .toUriString())
                .uploadDate(course.getUploadDate())
                .classeId(course.getClasse().getId())
                .teacherId(course.getTeacher().getId_utilisateur())
                .teacherName(course.getTeacher().getNom() + " " + course.getTeacher().getPrenom())
                .build();
    }
}
