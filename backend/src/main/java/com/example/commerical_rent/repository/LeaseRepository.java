package com.example.commerical_rent.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.commerical_rent.entity.LeaseAgreement;
import com.example.commerical_rent.enums.LeaseStatus;

@Repository
public interface LeaseRepository extends JpaRepository<LeaseAgreement, Long> {
    
    List<LeaseAgreement> findByTenant(String tenant);
    
    List<LeaseAgreement> findByProperty(String property);
    
    List<LeaseAgreement> findByLeaseStatus(LeaseStatus leaseStatus);
    
    List<LeaseAgreement> findByApprovedBy(String approvedBy);
}
