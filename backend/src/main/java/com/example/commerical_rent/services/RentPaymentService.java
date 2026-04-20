package com.example.commerical_rent.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.commerical_rent.dtos.RentPaymentDTO;
import com.example.commerical_rent.entity.LeaseAgreement;
import com.example.commerical_rent.entity.RentPayment;
import com.example.commerical_rent.enums.PaymentStatus;
import com.example.commerical_rent.repository.LeaseRepository;
import com.example.commerical_rent.repository.RentPaymentRepository;

@Service
public class RentPaymentService {

    @Autowired
    private RentPaymentRepository rentPaymentRepository;
    
    @Autowired
    private LeaseRepository leaseRepository;

    public List<RentPaymentDTO> getAllRentPayments() {
        return rentPaymentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<RentPaymentDTO> getRentPaymentById(Long id) {
        return rentPaymentRepository.findById(id).map(this::convertToDTO);
    }

    public RentPayment createRentPayment(RentPaymentDTO rentPaymentDTO) {
        // Fetch lease agreement
        LeaseAgreement lease = leaseRepository.findById(rentPaymentDTO.getLeaseAgreementId())
                .orElseThrow(() -> new IllegalArgumentException("Lease Agreement not found"));
        
        RentPayment rentPayment = new RentPayment();
        rentPayment.setLeaseAgreement(lease);
        rentPayment.setAmount(rentPaymentDTO.getAmount());
        rentPayment.setPaymentMonth(rentPaymentDTO.getPaymentMonth());
        rentPayment.setPaymentDate(rentPaymentDTO.getPaymentDate());
        rentPayment.setPaymentStatus(rentPaymentDTO.getPaymentStatus() != null ? rentPaymentDTO.getPaymentStatus() : PaymentStatus.INITIATED);
        rentPayment.setPenaltyAmount(rentPaymentDTO.getPenaltyAmount());
        rentPayment.setReferenceId(rentPaymentDTO.getReferenceId());
        rentPayment.setCreatedAt(LocalDateTime.now());
        
        return rentPaymentRepository.save(rentPayment);
    }

    public Optional<RentPayment> updateRentPayment(Long id, RentPaymentDTO rentPaymentDTO) {
        Optional<RentPayment> existingPayment = rentPaymentRepository.findById(id);
        
        if (existingPayment.isPresent()) {
            RentPayment rentPayment = existingPayment.get();
            
            if (rentPaymentDTO.getLeaseAgreementId() != null) {
                LeaseAgreement lease = leaseRepository.findById(rentPaymentDTO.getLeaseAgreementId())
                        .orElseThrow(() -> new IllegalArgumentException("Lease Agreement not found"));
                rentPayment.setLeaseAgreement(lease);
            }
            
            rentPayment.setAmount(rentPaymentDTO.getAmount());
            rentPayment.setPaymentMonth(rentPaymentDTO.getPaymentMonth());
            rentPayment.setPaymentDate(rentPaymentDTO.getPaymentDate());
            rentPayment.setPaymentStatus(rentPaymentDTO.getPaymentStatus());
            rentPayment.setPenaltyAmount(rentPaymentDTO.getPenaltyAmount());
            rentPayment.setReferenceId(rentPaymentDTO.getReferenceId());
            
            return Optional.of(rentPaymentRepository.save(rentPayment));
        }
        
        return Optional.empty();
    }

    public boolean deleteRentPayment(Long id) {
        if (rentPaymentRepository.existsById(id)) {
            rentPaymentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private RentPaymentDTO convertToDTO(RentPayment rentPayment) {
        RentPaymentDTO dto = new RentPaymentDTO();
        dto.setId(rentPayment.getId());
        dto.setLeaseAgreementId(rentPayment.getLeaseAgreement() != null ? rentPayment.getLeaseAgreement().getId() : null);
        dto.setAmount(rentPayment.getAmount());
        dto.setPaymentMonth(rentPayment.getPaymentMonth());
        dto.setPaymentDate(rentPayment.getPaymentDate());
        dto.setPaymentStatus(rentPayment.getPaymentStatus());
        dto.setPenaltyAmount(rentPayment.getPenaltyAmount());
        dto.setReferenceId(rentPayment.getReferenceId());
        dto.setCreatedAt(rentPayment.getCreatedAt());
        return dto;
    }
}
