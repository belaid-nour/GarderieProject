package com.example.garderie.controllers;

import com.example.garderie.dto.CourseDTO;
import com.example.garderie.entities.Course;
import com.example.garderie.entities.User;
import com.example.garderie.repository.UserRepository;
import com.example.garderie.services.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;

    // Upload d'un cours (POST /upload)
    @PostMapping("/upload")
    public ResponseEntity<Course> uploadCourse(
            @RequestParam("file") MultipartFile file,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Long classeId,
            @AuthenticationPrincipal UserDetails userDetails) throws Exception {

        User teacher = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Course savedCourse = courseService.uploadCourse(
                file,
                CourseDTO.builder()
                        .title(title)
                        .description(description)
                        .classeId(classeId)
                        .build(),
                teacher
        );

        return ResponseEntity.ok(savedCourse);
    }

    // Télécharger un cours (GET /download/{id})
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadCourse(@PathVariable Long id) {
        try {
            return courseService.downloadCourse(id);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Récupérer tous les cours d'une classe (GET /classe/{classeId})
    @GetMapping("/classe/{classeId}")
    public ResponseEntity<List<CourseDTO>> getByClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(courseService.getCoursesByClasse(classeId));
    }

    // Récupérer les cours du prof connecté (GET /teacher/me)
    @GetMapping("/teacher/me")
    public ResponseEntity<List<CourseDTO>> getMyCourses(@AuthenticationPrincipal UserDetails userDetails) {
        User teacher = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(courseService.getCoursesByTeacher(teacher.getId_utilisateur()));
    }

    // Suppression d’un cours (DELETE /{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Modification d’un cours (PUT /{id})
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Long classeId) {
        try {
            CourseDTO courseDTO = CourseDTO.builder()
                    .title(title)
                    .description(description)
                    .classeId(classeId)
                    .build();

            Course updatedCourse = courseService.updateCourse(id, courseDTO, file);
            return ResponseEntity.ok(updatedCourse);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors du traitement du fichier.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
