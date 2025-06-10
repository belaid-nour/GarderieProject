package com.example.garderie.mapper;

import com.example.garderie.dto.ClasseDTO;
import com.example.garderie.dto.EnfantDTO;
import com.example.garderie.entities.Classe;
import com.example.garderie.entities.Enfant;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClasseMapper {

    public ClasseDTO toClasseDTO(Classe classe) {
        return ClasseDTO.builder()
                .id(classe.getId())
                .nom(classe.getNom())
                .niveau(classe.getNiveau())
                .annee(classe.getAnnee()) // Mapping de l'année
                .effectifMax(classe.getEffectifMax()) // Mapping du nombre maximum d'enfants
                .enfants(mapEnfantsToDTO(classe.getEnfants()))
                .build();
    }

    private List<EnfantDTO> mapEnfantsToDTO(List<Enfant> enfants) {
        return enfants.stream()
                .map(this::toEnfantDTO)
                .collect(Collectors.toList());
    }

    private EnfantDTO toEnfantDTO(Enfant enfant) {
        return EnfantDTO.builder()
                .id(enfant.getId())
                .nom(enfant.getNom())
                .prenom(enfant.getPrenom())
                .niveau(enfant.getNiveau())
                .bus(enfant.isBus())
                .club(enfant.isClub())
                .gouter(enfant.isGouter())
                .tablier(enfant.isTablier())
                .livre(enfant.isLivre())
                .sexe(enfant.getSexe())
                .build();
    }
}
