package com.example.garderie.controllers;

import com.example.garderie.dto.SeanceDTO;
import com.example.garderie.entities.Seance;
import com.example.garderie.exceptions.ResourceNotFoundException;
import com.example.garderie.services.SeanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seances")
public class SeanceController {

    private final SeanceService seanceService;

    public SeanceController(SeanceService seanceService) {
        this.seanceService = seanceService;
    }

    @PostMapping("/{classeId}/{enseignantId}")
    public ResponseEntity<Seance> createSeance(
            @RequestBody SeanceDTO seanceDTO,
            @PathVariable Long classeId,
            @PathVariable Long enseignantId) {
        Seance newSeance = seanceService.createSeance(seanceDTO, classeId, enseignantId);
        return new ResponseEntity<>(newSeance, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Seance> getAllSeances() {
        return seanceService.getAllSeances();
    }

    @GetMapping("/classe/{classeId}")
    public List<Seance> getSeancesByClasse(@PathVariable Long classeId) {
        return seanceService.getSeancesByClasse(classeId);
    }

    @GetMapping("/enseignant/{enseignantId}")
    public List<Seance> getSeancesByEnseignant(@PathVariable Long enseignantId) {
        return seanceService.getSeancesByEnseignant(enseignantId);
    }
    // SeanceController.java
    @GetMapping("/{id}")
    public ResponseEntity<Seance> getSeanceById(@PathVariable Long id) {
        return ResponseEntity.ok(seanceService.getSeanceById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Seance> updateSeance(
            @PathVariable Long id,
            @RequestBody Seance seanceDetails) {
        Seance updatedSeance = seanceService.updateSeance(id, seanceDetails);
        return ResponseEntity.ok(updatedSeance);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSeance(@PathVariable Long id) {
        seanceService.deleteSeance(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}