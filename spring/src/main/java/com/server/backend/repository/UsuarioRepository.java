package com.server.backend.repository;

import com.server.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // Importe o Optional

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
   Optional<Usuario> findByEmail(String email);
   boolean existsByEmailIgnoreCase(String email);
    
}