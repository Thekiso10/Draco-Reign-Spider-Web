package com.thekiso.dragoreign.projectblue.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.thekiso.dragoreign.projectblue.entity.enums.StatusScraping;
import com.thekiso.dragoreign.projectblue.entity.enums.Web;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "scraping")
@Data
public class Scraping implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "Scraping_Seq")
    @SequenceGenerator(name = "Scraping_Seq")
    @Column(name = "id", nullable = false)
    private Long id;

    private Web nameScrapingWeb;

    private StatusScraping statusScraping;

    @UpdateTimestamp
    @JsonSerialize(using = ToStringSerializer.class)
    private LocalDateTime dateLastScraping;
}
