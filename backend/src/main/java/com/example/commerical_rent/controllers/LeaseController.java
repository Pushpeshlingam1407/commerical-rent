package com.example.commerical_rent.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.commerical_rent.dtos.LeaseDTO;
import com.example.commerical_rent.entity.LeaseAgreement;
import com.example.commerical_rent.enums.LeaseStatus;
import com.example.commerical_rent.services.LeaseService;

@RestController
@RequestMapping("/api/leases")
public class LeaseController {

    @Autowired
    private LeaseService leaseService;

    @PostMapping
    public ResponseEntity<LeaseAgreement> createLease(@RequestBody LeaseDTO leaseDto) {
        try {
            LeaseAgreement newLease = leaseService.createLease(leaseDto);
            return new ResponseEntity<>(newLease, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaseAgreement> getLeaseById(@PathVariable Long id) {
        Optional<LeaseAgreement> lease = leaseService.getLeaseById(id);

        if (lease.isPresent()) {
            return new ResponseEntity<>(lease.get(), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<List<LeaseAgreement>> getAllLeases() {
        List<LeaseAgreement> leases = leaseService.getAllLeases();
        return new ResponseEntity<>(leases, HttpStatus.OK);
    }

    @GetMapping("/tenant/{tenant}")
    public ResponseEntity<List<LeaseAgreement>> getLeasesByTenant(@PathVariable String tenant) {
        List<LeaseAgreement> leases = leaseService.getLeasesByTenant(tenant);
        return new ResponseEntity<>(leases, HttpStatus.OK);
    }

    @GetMapping("/property/{property}")
    public ResponseEntity<List<LeaseAgreement>> getLeasesByProperty(@PathVariable String property) {
        List<LeaseAgreement> leases = leaseService.getLeasesByProperty(property);
        return new ResponseEntity<>(leases, HttpStatus.OK);
    }

    @GetMapping("/status")
    public ResponseEntity<List<LeaseAgreement>> getLeasesByStatus(@RequestParam LeaseStatus status) {
        List<LeaseAgreement> leases = leaseService.getLeasesByStatus(status);
        return new ResponseEntity<>(leases, HttpStatus.OK);
    }

    @GetMapping("/approved-by/{approvedBy}")
    public ResponseEntity<List<LeaseAgreement>> getLeasesByApprovedBy(@PathVariable String approvedBy) {
        List<LeaseAgreement> leases = leaseService.getLeasesByApprovedBy(approvedBy);
        return new ResponseEntity<>(leases, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaseAgreement> updateLease(@PathVariable Long id, @RequestBody LeaseDTO leaseDto) {
        try {
            LeaseAgreement updatedLease = leaseService.updateLease(id, leaseDto);

            if (updatedLease != null) {
                return new ResponseEntity<>(updatedLease, HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<LeaseAgreement> approveLease(@PathVariable Long id, @RequestParam String approverName) {
        LeaseAgreement approvedLease = leaseService.approveLease(id, approverName);

        if (approvedLease != null) {
            return new ResponseEntity<>(approvedLease, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<LeaseAgreement> activateLease(@PathVariable Long id) {
        LeaseAgreement activatedLease = leaseService.activateLease(id);

        if (activatedLease != null) {
            return new ResponseEntity<>(activatedLease, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<LeaseAgreement> completeLease(@PathVariable Long id) {
        LeaseAgreement completedLease = leaseService.completeLease(id);

        if (completedLease != null) {
            return new ResponseEntity<>(completedLease, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/{id}/terminate")
    public ResponseEntity<LeaseAgreement> terminateLease(@PathVariable Long id) {
        LeaseAgreement terminatedLease = leaseService.terminateLease(id);

        if (terminatedLease != null) {
            return new ResponseEntity<>(terminatedLease, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<LeaseAgreement> cancelLease(@PathVariable Long id) {
        LeaseAgreement cancelledLease = leaseService.cancelLease(id);

        if (cancelledLease != null) {
            return new ResponseEntity<>(cancelledLease, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLease(@PathVariable Long id) {
        try {
            leaseService.deleteLease(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
