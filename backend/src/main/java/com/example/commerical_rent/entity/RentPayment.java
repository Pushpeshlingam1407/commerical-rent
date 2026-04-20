package com.example.commerical_rent.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.commerical_rent.enums.PaymentStatus;

@Entity
@Table(name = "rent_payments")
public class RentPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lease_agreement_id", nullable = false)
    private LeaseAgreement leaseAgreement;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_month", nullable = false)
    private LocalDate paymentMonth;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @Column(name = "penalty_amount")
    private BigDecimal penaltyAmount;

    @Column(name = "reference_id", unique = true)
    private String referenceId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    

    
    public RentPayment() {
    }

    public RentPayment(LeaseAgreement leaseAgreement, BigDecimal amount, LocalDate paymentMonth,
            PaymentStatus paymentStatus) {
        this.leaseAgreement = leaseAgreement;
        this.amount = amount;
        this.paymentMonth = paymentMonth;
        this.paymentStatus = paymentStatus;
        this.penaltyAmount = BigDecimal.ZERO;
    }

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LeaseAgreement getLeaseAgreement() {
        return leaseAgreement;
    }

    public void setLeaseAgreement(LeaseAgreement leaseAgreement) {
        this.leaseAgreement = leaseAgreement;
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
