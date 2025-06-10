package com.example.garderie.repository;

import com.example.garderie.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    // Requête personnalisée pour résoudre le problème de nommage
    @Query("SELECT c FROM Course c WHERE c.teacher.id_utilisateur = :teacherId")
    List<Course> findByTeacherId(@Param("teacherId") Long teacherId);

    List<Course> findByClasseId(Long classeId);
}