package com.example.garderie.controllers;

import com.example.garderie.dto.ClasseDTO;
import com.example.garderie.entities.Seance;
import com.example.garderie.mapper.ClasseMapper;
import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Enfant;
import com.example.garderie.exceptions.DuplicateClasseException;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.repository.ClasseRepository;
import com.example.garderie.services.ClasseService;
import com.example.garderie.services.SeanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService classeService;
    private final ClasseMapper classeMapper;
    private final ClasseRepository classeRepository;

    private final SeanceService seanceService;

    @GetMapping("/{id}")
    public ResponseEntity<ClasseDTO> getClasseById(@PathVariable Long id) {
        Classe classe = classeService.trouverClasseParId(id);
        return ResponseEntity.ok(classeMapper.toClasseDTO(classe));
    }

    @GetMapping
    public ResponseEntity<List<Classe>> getAllClasses() {
        return ResponseEntity.ok(classeService.getAllClasses());
    }

    @PostMapping
    public ResponseEntity<Classe> creerClasse(@RequestBody Classe classe)
            throws DuplicateClasseException {
        return ResponseEntity.ok(classeService.creerClasse(classe));
    }

    @GetMapping("/niveau/{niveau}")
    public ResponseEntity<List<Classe>> classesParNiveau(@PathVariable String niveau) {
        return ResponseEntity.ok(classeService.classesParNiveau(niveau));
    }
    // ClasseController.java
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getClassesByTeacher(@PathVariable Long teacherId) {
        try {
            List<Classe> classes = classeService.getClassesByTeacher(teacherId);
            return ResponseEntity.ok(classes);
        } catch (Exception ex) {
            ex.printStackTrace(); // Log l'erreur dans la console
            return ResponseEntity.internalServerError().body("Erreur interne: " + ex.getMessage());
        }
    }
    @PutMapping("/{classeId}/enfants/{enfantId}")
    public ResponseEntity<Void> assignerEnfant(
            @PathVariable Long classeId,
            @PathVariable Long enfantId
    ) {
        classeService.assignerEnfant(classeId, enfantId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/non-assignes/{niveau}")
    public ResponseEntity<List<Enfant>> enfantsNonAssignes(@PathVariable String niveau) {
        return ResponseEntity.ok(classeService.enfantsNonAssignes(niveau));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerClasse(@PathVariable Long id) {
        classeService.supprimerClasse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{classeId}/enfants")
    public ResponseEntity<List<Enfant>> getEnfantsParClasse(
            @PathVariable Long classeId
    ) {
        try {
            List<Enfant> enfants = classeService.trouverEnfantsParClasseId(classeId);
            return ResponseEntity.ok(enfants);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/by-ids")
    public ResponseEntity<List<Classe>> getClassesByIds(@RequestParam List<Long> ids) {
        List<Classe> classes = classeRepository.findAllById(ids);
        return ResponseEntity.ok(classes);
    }
}
