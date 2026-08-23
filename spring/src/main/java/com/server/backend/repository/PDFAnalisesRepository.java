package com.server.backend.repository;

import com.server.backend.model.PDFAnalises;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PDFAnalisesRepository extends JpaRepository<PDFAnalises, Long> {
    List<PDFAnalises> findByUserIdAndActive(Long userId, Boolean active);
}