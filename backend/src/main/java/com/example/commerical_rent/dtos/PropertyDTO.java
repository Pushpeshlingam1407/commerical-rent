package com.example.commerical_rent.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.commerical_rent.enums.PropertyStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PropertyDTO {
    private Long id;

    @NotBlank(message = "Property name is required")
    private String propertyName;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    @NotNull(message = "Monthly rent amount is required")
    @Positive(message = "Monthly rent amount must be positive")
    private BigDecimal monthlyRentAmount;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    @NotNull(message = "Availability status is required")
    private PropertyStatus availabilityStatus;

    private LocalDateTime createdAt;

    public PropertyDTO() {
    }

    public PropertyDTO(Long id, String propertyName, String location, String propertyType,
            BigDecimal monthlyRentAmount, Long ownerId, PropertyStatus availabilityStatus,
            LocalDateTime createdAt) {
        this.id = id;
        this.propertyName = propertyName;
        this.location = location;
        this.propertyType = propertyType;
        this.monthlyRentAmount = monthlyRentAmount;
        this.ownerId = ownerId;
        this.availabilityStatus = availabilityStatus;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public BigDecimal getMonthlyRentAmount() {
        return monthlyRentAmount;
    }

    public void setMonthlyRentAmount(BigDecimal monthlyRentAmount) {
        this.monthlyRentAmount = monthlyRentAmount;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public PropertyStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(PropertyStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
