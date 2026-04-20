package com.example.commerical_rent.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.commerical_rent.dtos.LeaseDto;
import com.example.commerical_rent.entity.LeaseAgreement;
import com.example.commerical_rent.enums.LeaseStatus;
import com.example.commerical_rent.repository.LeaseRepository;

@Service
public class LeaseService {
    
    @Autowired
    private LeaseRepository leaseRepository;
    
    // Create a new lease agreement
    public LeaseAgreement createLease(LeaseDto leaseDto) {
        LeaseAgreement lease = new LeaseAgreement();
        lease.setProperty(leaseDto.getProperty());
        lease.setTenant(leaseDto.getTenant());
        lease.setLeaseStartDate(leaseDto.getLeaseStartDate());
        lease.setLeaseEndDate(leaseDto.getLeaseEndDate());
        lease.setMonthlyRentAmount(leaseDto.getMonthlyRentAmount());
        lease.setSecurityDeposit(leaseDto.getSecurityDeposit());
        lease.setApprovedBy(leaseDto.getApprovedBy());
        lease.setLeaseStatus(LeaseStatus.REQUESTED);
        
        return leaseRepository.save(lease);
    }
    
    // Get lease by ID
    public Optional<LeaseAgreement> getLeaseById(Long id) {
        return leaseRepository.findById(id);
    }
    
    // Get all leases
    public List<LeaseAgreement> getAllLeases() {
        return leaseRepository.findAll();
    }
    
    // Get leases by tenant
    public List<LeaseAgreement> getLeasesByTenant(String tenant) {
        return leaseRepository.findByTenant(tenant);
    }
    
    // Get leases by property
    public List<LeaseAgreement> getLeasesByProperty(String property) {
        return leaseRepository.findByProperty(property);
    }
    
    // Get leases by status
    public List<LeaseAgreement> getLeasesByStatus(LeaseStatus status) {
        return leaseRepository.findByLeaseStatus(status);
    }
    
    // Get leases by approval manager
    public List<LeaseAgreement> getLeasesByApprovedBy(String approvedBy) {
        return leaseRepository.findByApprovedBy(approvedBy);
    }
    
    // Update lease
    public LeaseAgreement updateLease(Long id, LeaseDto leaseDto) {
        Optional<LeaseAgreement> existingLease = leaseRepository.findById(id);
        
        if (existingLease.isPresent()) {
            LeaseAgreement lease = existingLease.get();
            lease.setProperty(leaseDto.getProperty());
            lease.setTenant(leaseDto.getTenant());
            lease.setLeaseStartDate(leaseDto.getLeaseStartDate());
            lease.setLeaseEndDate(leaseDto.getLeaseEndDate());
            lease.setMonthlyRentAmount(leaseDto.getMonthlyRentAmount());
            lease.setSecurityDeposit(leaseDto.getSecurityDeposit());
            lease.setApprovedBy(leaseDto.getApprovedBy());
            
            return leaseRepository.save(lease);
        }
        
        return null;
    }
    
    // Approve lease
    public LeaseAgreement approveLease(Long id, String approverName) {
        Optional<LeaseAgreement> lease = leaseRepository.findById(id);
        
        if (lease.isPresent()) {
            LeaseAgreement leaseToApprove = lease.get();
            if (leaseToApprove.getLeaseStatus() == LeaseStatus.REQUESTED) {
                leaseToApprove.setLeaseStatus(LeaseStatus.APPROVED);
                leaseToApprove.setApprovedBy(approverName);
                return leaseRepository.save(leaseToApprove);
            }
        }
        
        return null;
    }
    
    // Activate lease
    public LeaseAgreement activateLease(Long id) {
        Optional<LeaseAgreement> lease = leaseRepository.findById(id);
        
        if (lease.isPresent()) {
            LeaseAgreement leaseToActivate = lease.get();
            if (leaseToActivate.getLeaseStatus() == LeaseStatus.APPROVED) {
                leaseToActivate.setLeaseStatus(LeaseStatus.ACTIVE);
                return leaseRepository.save(leaseToActivate);
            }
        }
        
        return null;
    }
    
    // Complete lease
    public LeaseAgreement completeLease(Long id) {
        Optional<LeaseAgreement> lease = leaseRepository.findById(id);
        
        if (lease.isPresent()) {
            LeaseAgreement leaseToComplete = lease.get();
            if (leaseToComplete.getLeaseStatus() == LeaseStatus.ACTIVE) {
                leaseToComplete.setLeaseStatus(LeaseStatus.COMPLETED);
                return leaseRepository.save(leaseToComplete);
            }
        }
        
        return null;
    }
    
    // Terminate lease
    public LeaseAgreement terminateLease(Long id) {
        Optional<LeaseAgreement> lease = leaseRepository.findById(id);
        
        if (lease.isPresent()) {
            LeaseAgreement leaseToTerminate = lease.get();
            if (leaseToTerminate.getLeaseStatus() == LeaseStatus.ACTIVE || 
                leaseToTerminate.getLeaseStatus() == LeaseStatus.APPROVED) {
                leaseToTerminate.setLeaseStatus(LeaseStatus.TERMINATED);
                return leaseRepository.save(leaseToTerminate);
            }
        }
        
        return null;
    }
    
    // Cancel lease
    public LeaseAgreement cancelLease(Long id) {
        Optional<LeaseAgreement> lease = leaseRepository.findById(id);
        
        if (lease.isPresent()) {
            LeaseAgreement leaseToCancelCancel = lease.get();
            if (leaseToCancelCancel.getLeaseStatus() == LeaseStatus.REQUESTED || 
                leaseToCancelCancel.getLeaseStatus() == LeaseStatus.APPROVED) {
                leaseToCancelCancel.setLeaseStatus(LeaseStatus.CANCELLED);
                return leaseRepository.save(leaseToCancelCancel);
            }
        }
        
        return null;
    }
    
    // Delete lease
    public void deleteLease(Long id) {
        leaseRepository.deleteById(id);
    }
}
