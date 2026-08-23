package com.server.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pdf_analises", schema = "public")
public class PDFAnalises {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "pdf_extract", columnDefinition = "TEXT")
    private String pdfExtract;

    @Column(name = "data")
    private LocalDateTime data;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "analise_ia", columnDefinition = "TEXT")
    private String analiseIa;

    public PDFAnalises() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPdfExtract() {
        return pdfExtract;
    }

    public void setPdfExtract(String pdfExtract) {
        this.pdfExtract = pdfExtract;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getAnaliseIa() {
        return analiseIa;
    }

    public void setAnaliseIa(String analiseIa) {
        this.analiseIa = analiseIa;
    }
}