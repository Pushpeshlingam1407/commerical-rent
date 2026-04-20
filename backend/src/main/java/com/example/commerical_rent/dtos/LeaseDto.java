package com.example.commerical_rent.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.commerical_rent.enums.LeaseStatus;

public class LeaseDTO {

    private Long id;
    private String property;
    private String tenant;
    private LocalDate leaseStartDate;
    private LocalDate leaseEndDate;
    private Double monthlyRentAmount;
    private Double securityDeposit;
    private LeaseStatus leaseStatus;
    private LocalDateTime createdAt;
    private String approvedBy;

    
    public LeaseDTO() {
    }

    public LeaseDTO(String property, String tenant, LocalDate leaseStartDate,
            LocalDate leaseEndDate, Double monthlyRentAmount,
            Double securityDeposit, String approvedBy) {
        this.property = property;
        this.tenant = tenant;
        this.leaseStartDate = leaseStartDate;
        this.leaseEndDate = leaseEndDate;
        this.monthlyRentAmount = monthlyRentAmount;
        this.securityDeposit = securityDeposit;
        this.approvedBy = approvedBy;
    }

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public String getTenant() {
        return tenant;
    }

    public void setTenant(String tenant) {
        this.tenant = tenant;
    }

    public LocalDate getLeaseStartDate() {
        return leaseStartDate;
    }

    public void setLeaseStartDate(LocalDate leaseStartDate) {
        this.leaseStartDate = leaseStartDate;
    }

    public LocalDate getLeaseEndDate() {
        return leaseEndDate;
    }

    public void setLeaseEndDate(LocalDate leaseEndDate) {
        this.leaseEndDate = leaseEndDate;
    }

    public Double getMonthlyRentAmount() {
        return monthlyRentAmount;
    }

    public void setMonthlyRentAmount(Double monthlyRentAmount) {
        this.monthlyRentAmount = monthlyRentAmount;
    }

    public Double getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(Double securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public LeaseStatus getLeaseStatus() {
        return leaseStatus;
    }

    public void setLeaseStatus(LeaseStatus leaseStatus) {
        this.leaseStatus = leaseStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }
}
