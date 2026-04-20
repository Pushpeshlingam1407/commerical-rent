package com.example.commerical_rent.dtos;

import com.example.commerical_rent.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RentPaymentDTO {
    private Long id;
    private Long leaseAgreementId; // Reference to LeaseAgreement ID
    private BigDecimal amount;
    private LocalDate paymentMonth;
    private LocalDate paymentDate;
    private PaymentStatus paymentStatus;
    private BigDecimal penaltyAmount;
    private String referenceId;
    private LocalDateTime createdAt;

    
    public RentPaymentDTO() {
    }

    public RentPaymentDTO(Long id, Long leaseAgreementId, BigDecimal amount, LocalDate paymentMonth,
                          LocalDate paymentDate, PaymentStatus paymentStatus, BigDecimal penaltyAmount,
                          String referenceId, LocalDateTime createdAt) {
        this.id = id;
        this.leaseAgreementId = leaseAgreementId;
        this.amount = amount;
        this.paymentMonth = paymentMonth;
        this.paymentDate = paymentDate;
        this.paymentStatus = paymentStatus;
        this.penaltyAmount = penaltyAmount;
        this.referenceId = referenceId;
        this.createdAt = createdAt;
    }

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLeaseAgreementId() {
        return leaseAgreementId;
    }

    public void setLeaseAgreementId(Long leaseAgreementId) {
        this.leaseAgreementId = leaseAgreementId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getPaymentMonth() {
        return paymentMonth;
    }

    public void setPaymentMonth(LocalDate paymentMonth) {
        this.paymentMonth = paymentMonth;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public BigDecimal getPenaltyAmount() {
        return penaltyAmount;
    }

    public void setPenaltyAmount(BigDecimal penaltyAmount) {
        this.penaltyAmount = penaltyAmount;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
