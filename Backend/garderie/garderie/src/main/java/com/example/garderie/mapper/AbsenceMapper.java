package com.example.garderie.mapper;

import com.example.garderie.dto.AbsenceDTO;
import com.example.garderie.entities.Absence;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AbsenceMapper {
    @Mapping(target = "enfant", ignore = true)
    @Mapping(target = "seance", ignore = true)
    Absence toEntity(AbsenceDTO dto);

    @Mapping(source = "enfant.id", target = "enfantId")
    @Mapping(source = "seance.id", target = "seanceId")
    AbsenceDTO toDto(Absence absence);
}