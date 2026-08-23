package com.server.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

    @Autowired
    private Environment env;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Retorna false para o filtro rodar em TUDO o que for requisição e validar a chave
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Pega a chave configurada no application.properties (se não achar, usa "minha-chave-super-secreta-123" como padrão)
        String chaveCadastrada = env.getProperty("api.security.key", "minha-chave-super-secreta-123");
        
        // Pega o que o cliente mandou no header
        String headerKey = request.getHeader("x-api-key");

        // Logs no console para você ver o que está acontecendo exatamente
        System.out.println("[DEBUG FILTRO] Rota: " + request.getRequestURI());
        System.out.println("[DEBUG FILTRO] Chave esperada: " + chaveCadastrada);
        System.out.println("[DEBUG FILTRO] Chave recebida no Header: " + headerKey);

        if (chaveCadastrada != null && chaveCadastrada.equals(headerKey)) {
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        "api-client", 
                        null, 
                        List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"erro\": \"Chave de API inválida ou ausente\"}");
        }
    }
}