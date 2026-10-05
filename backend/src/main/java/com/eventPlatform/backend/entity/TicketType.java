package com.eventPlatform.backend.entity;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "ticket_types")
public class TicketType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    private Integer quantity;
    private Integer available;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    public TicketType() {}

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getAvailable() { return available; }
    public void setAvailable(Integer available) { this.available = available; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
}