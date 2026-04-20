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
import org.springframework.web.bind.annotation.RestController;

import com.example.commerical_rent.dtos.RentPaymentDTO;
import com.example.commerical_rent.entity.RentPayment;
import com.example.commerical_rent.services.RentPaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/rent-payments")
public class RentPaymentController {

    @Autowired
    private RentPaymentService rentPaymentService;

    @GetMapping
    public ResponseEntity<List<RentPaymentDTO>> getAllRentPayments() {
        try {
            List<RentPaymentDTO> rentPayments = rentPaymentService.getAllRentPayments();
            return ResponseEntity.ok(rentPayments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentPaymentDTO> getRentPaymentById(@PathVariable Long id) {
        try {
            Optional<RentPaymentDTO> rentPayment = rentPaymentService.getRentPaymentById(id);
            return rentPayment.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createRentPayment(@Valid @RequestBody RentPaymentDTO rentPaymentDTO) {
        try {
            RentPayment createdRentPayment = rentPaymentService.createRentPayment(rentPaymentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRentPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRentPayment(@PathVariable Long id,
            @Valid @RequestBody RentPaymentDTO rentPaymentDTO) {
        try {
            Optional<RentPayment> updatedRentPayment = rentPaymentService.updateRentPayment(id, rentPaymentDTO);
            return updatedRentPayment.map(payment -> ResponseEntity.ok((Object) payment))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRentPayment(@PathVariable Long id) {
        try {
            boolean deleted = rentPaymentService.deleteRentPayment(id);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
