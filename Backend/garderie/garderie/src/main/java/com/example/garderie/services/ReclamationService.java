package com.example.garderie.services;

import com.example.garderie.entities.Reclamation;
import com.example.garderie.entities.User;
import com.example.garderie.repository.ReclamationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;

    public ReclamationService(ReclamationRepository reclamationRepository) {
        this.reclamationRepository = reclamationRepository;
    }

    public Reclamation save(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> findAll() {
        return reclamationRepository.findAll();
    }

    public List<Reclamation> findByParent(User parent) {
        return reclamationRepository.findByParent(parent);
    }

    public Optional<Reclamation> findById(Long id) {
        return reclamationRepository.findById(id);
    }

    public void delete(Long id) {
        reclamationRepository.deleteById(id);
    }
}