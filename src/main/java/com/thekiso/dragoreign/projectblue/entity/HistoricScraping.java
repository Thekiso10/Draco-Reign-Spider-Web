package com.thekiso.dragoreign.projectblue.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.thekiso.dragoreign.projectblue.entity.enums.StatusScraping;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "historic_scraping")
@Data
public class HistoricScraping implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "HistoricScraping_Seq")
    @SequenceGenerator(name = "HistoricScraping_Seq")
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "scraping_id")
    private Scraping scraping;

    private StatusScraping statusScraping;

    @CreationTimestamp
    @JsonSerialize(using = ToStringSerializer.class)
    private LocalDateTime dateScraping;
}
