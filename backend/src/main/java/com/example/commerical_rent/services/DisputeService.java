package com.example.commerical_rent.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.commerical_rent.dtos.DisputeDTO;
import com.example.commerical_rent.entity.Dispute;
import com.example.commerical_rent.entity.LeaseAgreement;
import com.example.commerical_rent.entity.User;
import com.example.commerical_rent.enums.DisputeStatus;
import com.example.commerical_rent.repository.DisputeRepository;
import com.example.commerical_rent.repository.LeaseRepository;
import com.example.commerical_rent.repository.UserRepository;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;
    
    @Autowired
    private LeaseRepository leaseRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<DisputeDTO> getAllDisputes() {
        return disputeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<DisputeDTO> getDisputeById(Long id) {
        return disputeRepository.findById(id).map(this::convertToDTO);
    }

    public Dispute createDispute(DisputeDTO disputeDTO) {
        // Fetch related entities
        LeaseAgreement lease = leaseRepository.findById(disputeDTO.getLeaseAgreementId())
                .orElseThrow(() -> new IllegalArgumentException("Lease Agreement not found"));
        
        User raisedBy = userRepository.findById(disputeDTO.getRaisedById())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Dispute dispute = new Dispute();
        dispute.setLeaseAgreement(lease);
        dispute.setRaisedBy(raisedBy);
        dispute.setDisputeReason(disputeDTO.getDisputeReason());
        dispute.setDisputeStatus(disputeDTO.getDisputeStatus() != null ? disputeDTO.getDisputeStatus() : DisputeStatus.OPEN);
        dispute.setCreatedAt(LocalDateTime.now());
        
        return disputeRepository.save(dispute);
    }

    public Optional<Dispute> updateDispute(Long id, DisputeDTO disputeDTO) {
        Optional<Dispute> existingDispute = disputeRepository.findById(id);
        
        if (existingDispute.isPresent()) {
            Dispute dispute = existingDispute.get();
            
            if (disputeDTO.getLeaseAgreementId() != null) {
                LeaseAgreement lease = leaseRepository.findById(disputeDTO.getLeaseAgreementId())
                        .orElseThrow(() -> new IllegalArgumentException("Lease Agreement not found"));
                dispute.setLeaseAgreement(lease);
            }
            
            if (disputeDTO.getRaisedById() != null) {
                User raisedBy = userRepository.findById(disputeDTO.getRaisedById())
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                dispute.setRaisedBy(raisedBy);
            }
            
            dispute.setDisputeReason(disputeDTO.getDisputeReason());
            dispute.setDisputeStatus(disputeDTO.getDisputeStatus());
            dispute.setResolutionRemark(disputeDTO.getResolutionRemark());
            
            return Optional.of(disputeRepository.save(dispute));
        }
        
        return Optional.empty();
    }

    public boolean deleteDispute(Long id) {
        if (disputeRepository.existsById(id)) {
            disputeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private DisputeDTO convertToDTO(Dispute dispute) {
        DisputeDTO dto = new DisputeDTO();
        dto.setId(dispute.getId());
        dto.setLeaseAgreementId(dispute.getLeaseAgreement() != null ? dispute.getLeaseAgreement().getId() : null);
        dto.setRaisedById(dispute.getRaisedBy() != null ? dispute.getRaisedBy().getId() : null);
        dto.setDisputeReason(dispute.getDisputeReason());
        dto.setDisputeStatus(dispute.getDisputeStatus());
        dto.setResolutionRemark(dispute.getResolutionRemark());
        dto.setResolvedById(dispute.getResolvedBy() != null ? dispute.getResolvedBy().getId() : null);
        dto.setCreatedAt(dispute.getCreatedAt());
        dto.setResolvedAt(dispute.getResolvedAt());
        return dto;
    }
}
