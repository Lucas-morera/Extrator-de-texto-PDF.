package com.server.backend.controller;

import com.server.backend.model.Usuario;
import com.server.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.server.backend.dto.LoginDTO; // Ajuste o pacote conforme o caminho correto da sua aplicação

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioService cadastroService;

    @GetMapping("/teste")
    public List<Map<String, Object>> getMethodName() {
        return List.of(
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),

                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),

                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 1, "coluna1", "Valor A", "coluna2", "Valor B"),
                Map.of("id", 2, "coluna1", "Valor C", "coluna2", "Valor D"));
    }

   @PostMapping("/cadastro")
public ResponseEntity<Map<String, Object>> insertPost(@RequestBody Usuario request) {
    Map<String, Object> response = new HashMap<>();
    try {
        // Validação dos campos obrigatórios
        if (request.getNome() == null || request.getNome().isBlank()) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "O campo 'nome' é obrigatório!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "O campo 'email' é obrigatório!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        if (request.getCidade() == null || request.getCidade().isBlank()) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "O campo 'cidade' é obrigatório!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        if (request.getTelefone() == null || request.getTelefone().isBlank()) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "O campo 'telefone' é obrigatório!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        if (request.getSenha() == null || request.getSenha().isBlank()) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "O campo 'senha' é obrigatório!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        Usuario cadastroSalvo = cadastroService.save(request);

       

        response.put("success", true);
        response.put("resposta", "Salvo com sucesso!");
        response.put("data", cadastroSalvo);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    } catch (IllegalArgumentException e) {
        response.put("success", false);
        response.put("mensagem", e.getMessage());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}   

    @PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO request) {
    Map<String, Object> response = new HashMap<>();

    try {
        Usuario usuario = cadastroService.autenticar(request.email(), request.senha());

        response.put("success", true);
        response.put("mensagem", "Login realizado com sucesso!");
        response.put("data", usuario);

        return ResponseEntity.ok(response);

    } catch (IllegalArgumentException e) {
        response.put("success", false);
        response.put("mensagem", e.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}


    

}