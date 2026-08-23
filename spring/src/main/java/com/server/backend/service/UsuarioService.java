package com.server.backend.service;

import com.server.backend.model.Usuario;
import com.server.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Busca todos os registros
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }


    public Usuario save(Usuario usuario) {
        if (usuarioRepository.existsByEmailIgnoreCase(usuario.getEmail().trim())) {
            throw new IllegalArgumentException("O e-mail " + usuario.getEmail() + " já está cadastrado!");
        }

        // Faz o hash da senha antes de salvar
        String senhaHash = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaHash);

        return usuarioRepository.save(usuario);
    }


 public Usuario autenticar(String email, String senha) {
    // 1. Validação básica de campos
    if (email == null || email.isBlank() || senha == null || senha.isBlank()) {
        throw new IllegalArgumentException("E-mail e senha são obrigatórios!");
    }

    // 2. Busca o usuário no banco
    Usuario usuario = usuarioRepository.findByEmail(email.trim())
            .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos!"));

    // 3. Valida a senha contra o hash criptografado
    if (!passwordEncoder.matches(senha, usuario.getSenha())) {
        throw new IllegalArgumentException("E-mail ou senha inválidos!");
    }

    return usuario;
}
}