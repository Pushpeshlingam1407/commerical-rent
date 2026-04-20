package com.example.commerical_rent.dtos;

import com.example.commerical_rent.enums.PropertyStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PropertyDTO {
    private Long id;
    private String propertyName;
    private String location;
    private String propertyType;
    private BigDecimal monthlyRentAmount;
    private Long ownerId; // Reference to User ID
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
