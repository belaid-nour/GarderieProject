package com.example.garderie.mapper;

import com.example.garderie.dto.NotificationDTO;
import com.example.garderie.entities.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "absence", ignore = true)
    @Mapping(target = "avertissement", ignore = true)
    Notification toEntity(NotificationDTO dto);

    @Mapping(source = "parent.id_utilisateur", target = "parentId")
    @Mapping(source = "absence.id", target = "absenceId")
    @Mapping(source = "avertissement.id", target = "avertissementId")
    NotificationDTO toDto(Notification entity);
}