package com.example.garderie.controllers;

import com.example.garderie.enums.Role;
import com.example.garderie.services.ClasseService;
import com.example.garderie.services.EnfantService;
import com.example.garderie.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final UserRepository userRepository;
    private final EnfantService enfantService;
    private final ClasseService classeService;

    public DashboardController(UserRepository userRepository, EnfantService enfantService, ClasseService classeService) {
        this.userRepository = userRepository;
        this.enfantService = enfantService;
        this.classeService = classeService;
    }

    @GetMapping("/totals")
    public Map<String, Object> getTotals() {
        Map<String, Object> totals = new HashMap<>();

        totals.put("admins", userRepository.countByRole(Role.Admin));
        totals.put("parents", userRepository.countByRole(Role.Parent));
        totals.put("teachers", userRepository.countByRole(Role.Teacher));
        totals.put("enfants", enfantService.findAllEnfants().size());

        // Enfants par sexe
        Map<String, Long> enfantsParSexe = enfantService.countEnfantsBySexe();
        totals.put("enfantsParSexe", enfantsParSexe);

        // Classes par niveau
        Map<String, Long> classesParNiveau = classeService.getNombreClassesParNiveau();
        totals.put("classesParNiveau", classesParNiveau);

        // Enfants par classe par niveau
        Map<String, Map<String, Integer>> enfantsParClasseParNiveau = classeService.getNombreEnfantsParClasseParNiveau();
        totals.put("enfantsParClasseParNiveau", enfantsParClasseParNiveau);

        return totals;
    }}