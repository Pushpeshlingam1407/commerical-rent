package com.example.commerical_rent.controllers;

import com.example.commerical_rent.dtos.RentPaymentDTO;
import com.example.commerical_rent.services.RentPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rent-payments")
public class RentPaymentController {

    @Autowired
    private RentPaymentService rentPaymentService;

    @GetMapping
    public ResponseEntity<List<RentPaymentDTO>> getAllRentPayments() {
        List<RentPaymentDTO> rentPayments = rentPaymentService.getAllRentPayments();
        return ResponseEntity.ok(rentPayments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentPaymentDTO> getRentPaymentById(@PathVariable Long id) {
        Optional<RentPaymentDTO> rentPayment = rentPaymentService.getRentPaymentById(id);
        return rentPayment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RentPaymentDTO> createRentPayment(@RequestBody RentPaymentDTO rentPaymentDTO) {
        RentPaymentDTO createdRentPayment = rentPaymentService.createRentPayment(rentPaymentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRentPayment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentPaymentDTO> updateRentPayment(@PathVariable Long id,
            @RequestBody RentPaymentDTO rentPaymentDTO) {
        Optional<RentPaymentDTO> updatedRentPayment = rentPaymentService.updateRentPayment(id, rentPaymentDTO);
        return updatedRentPayment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRentPayment(@PathVariable Long id) {
        boolean deleted = rentPaymentService.deleteRentPayment(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
