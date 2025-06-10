package com.example.garderie.controllers;

import com.example.garderie.dto.AvertissementDTO;
import com.example.garderie.dto.AvertissementResponseDTO;
import com.example.garderie.entities.Avertissement;
import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Enfant;
import com.example.garderie.services.AvertissementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avertissements")
@RequiredArgsConstructor
public class AvertissementController {

    private final AvertissementService avertissementService;

    @PostMapping
    public ResponseEntity<AvertissementResponseDTO> creerAvertissement(
            @Valid @RequestBody AvertissementDTO dto) {
        Avertissement avertissement = avertissementService.creerAvertissement(dto);
        AvertissementResponseDTO createdAvertissement = AvertissementResponseDTO.fromEntity(avertissement);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdAvertissement.id())
                .toUri();

        return ResponseEntity.created(location).body(createdAvertissement);
    }

    @GetMapping("/enseignant/{enseignantId}/classes")
    public ResponseEntity<Map<Classe, List<Enfant>>> getClassesEtEleves(
            @PathVariable Long enseignantId) {
        return ResponseEntity.ok(avertissementService.getClassesEtElevesParEnseignant(enseignantId));
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<List<Avertissement>> getAvertissementsParEnfant(
            @PathVariable Long enfantId) {
        return ResponseEntity.ok(avertissementService.getByEnfant(enfantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvertissementResponseDTO> getAvertissementById(
            @PathVariable Long id) {
        return ResponseEntity.ok(avertissementService.getById(id));
    }

    @GetMapping("/enseignant/{enseignantId}")
    public ResponseEntity<List<Avertissement>> getAvertissementsParEnseignant(
            @PathVariable Long enseignantId) {
        return ResponseEntity.ok(avertissementService.getByEnseignant(enseignantId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
    @GetMapping
    public ResponseEntity<List<Avertissement>> getAllAvertissements() {
        List<Avertissement> avertissements = avertissementService.getAll();
        return ResponseEntity.ok(avertissements);
    }

}
