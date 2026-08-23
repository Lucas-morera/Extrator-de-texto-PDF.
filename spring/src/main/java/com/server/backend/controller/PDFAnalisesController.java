package com.server.backend.controller;

import com.server.backend.dto.SalvarTextoRequest;
import com.server.backend.model.PDFAnalises;
import com.server.backend.repository.PDFAnalisesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
public class PDFAnalisesController {

    @Autowired
    private PDFAnalisesRepository pdfAnalisesRepository;



   @PostMapping("/salvar_texto")
    public ResponseEntity<?> salvarTexto(@RequestBody SalvarTextoRequest request) {
    if (request.getId() == null) {
        return ResponseEntity.badRequest().body("Campo 'id' é obrigatório.");
    }
    if (request.getTexto() == null || request.getTexto().isBlank()) {
        return ResponseEntity.badRequest().body("Campo 'texto' é obrigatório.");
    }

    PDFAnalises entity = new PDFAnalises();
    entity.setUserId(request.getId());
    entity.setPdfExtract(request.getTexto());
    entity.setData(LocalDateTime.now()); // fixo
    entity.setActive(true);              // fixo
    // analiseIa fica null (fixo, não seta nada)

    PDFAnalises salvo = pdfAnalisesRepository.save(entity);
    return ResponseEntity.ok(salvo);
}

@GetMapping("/meus_pdfs/{userId}")
    public ResponseEntity<List<PDFAnalises>> getRegistrosPorUsuario(@PathVariable Long userId) {
        
        // Busca apenas os registros do usuário informado que estão com active = true
        List<PDFAnalises> registros = pdfAnalisesRepository.findByUserIdAndActive(userId, true);
        
        if (registros.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retorna 204 se não achar nada
        }
        
        return ResponseEntity.ok(registros); // Retorna 200 com a lista de PDFs
    }
}