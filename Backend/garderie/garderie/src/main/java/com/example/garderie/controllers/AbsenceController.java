package com.example.garderie.controllers;

import com.example.garderie.dto.AbsenceDTO;
import com.example.garderie.entities.Absence;
import com.example.garderie.services.AbsenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/absences")
@RequiredArgsConstructor
public class AbsenceController {
    private final AbsenceService absenceService;

    @PostMapping
    public ResponseEntity<Absence> creerAbsence(@RequestBody AbsenceDTO absenceDTO) {
        return ResponseEntity.ok(absenceService.creerAbsence(absenceDTO));
    }

    @GetMapping("/seance/{seanceId}")
    public ResponseEntity<List<Absence>> getAbsencesParSeance(@PathVariable Long seanceId) {
        return ResponseEntity.ok(absenceService.getAbsencesParSeance(seanceId));
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<List<Absence>> getAbsencesParEnfant(@PathVariable Long enfantId) {
        return ResponseEntity.ok(absenceService.getAbsencesParEnfant(enfantId));
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Absence> mettreAJourStatut(
            @PathVariable Long id,
            @RequestParam boolean justifiee
    ) {
        return ResponseEntity.ok(absenceService.mettreAJourStatut(id, justifiee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAbsence(@PathVariable Long id) {
        absenceService.supprimerAbsence(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/classe/{classeId}")
    public ResponseEntity<List<Absence>> getAbsencesParClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(absenceService.getAbsencesParClasse(classeId));
    }

}