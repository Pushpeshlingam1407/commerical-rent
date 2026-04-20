package com.example.commerical_rent.dtos;

import java.time.LocalDateTime;

import com.example.commerical_rent.enums.DisputeStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DisputeDTO {
    private Long id;

    @NotNull(message = "Lease Agreement ID is required")
    private Long leaseAgreementId;

    @NotNull(message = "Raised By ID is required")
    private Long raisedById;

    @NotBlank(message = "Dispute reason is required")
    private String disputeReason;

    @NotNull(message = "Dispute status is required")
    private DisputeStatus disputeStatus;

    private String resolutionRemark;
    private Long resolvedById;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public DisputeDTO() {
    }

    public DisputeDTO(Long id, Long leaseAgreementId, Long raisedById, String disputeReason,
            DisputeStatus disputeStatus, String resolutionRemark, Long resolvedById,
            LocalDateTime createdAt, LocalDateTime resolvedAt) {
        this.id = id;
        this.leaseAgreementId = leaseAgreementId;
        this.raisedById = raisedById;
        this.disputeReason = disputeReason;
        this.disputeStatus = disputeStatus;
        this.resolutionRemark = resolutionRemark;
        this.resolvedById = resolvedById;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
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

    public Long getRaisedById() {
        return raisedById;
    }

    public void setRaisedById(Long raisedById) {
        this.raisedById = raisedById;
    }

    public String getDisputeReason() {
        return disputeReason;
    }

    public void setDisputeReason(String disputeReason) {
        this.disputeReason = disputeReason;
    }

    public DisputeStatus getDisputeStatus() {
        return disputeStatus;
    }

    public void setDisputeStatus(DisputeStatus disputeStatus) {
        this.disputeStatus = disputeStatus;
    }

    public String getResolutionRemark() {
        return resolutionRemark;
    }

    public void setResolutionRemark(String resolutionRemark) {
        this.resolutionRemark = resolutionRemark;
    }

    public Long getResolvedById() {
        return resolvedById;
    }

    public void setResolvedById(Long resolvedById) {
        this.resolvedById = resolvedById;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}
