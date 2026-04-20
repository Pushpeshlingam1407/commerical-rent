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

import com.example.commerical_rent.dtos.DisputeDTO;
import com.example.commerical_rent.entity.Dispute;
import com.example.commerical_rent.services.DisputeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    @Autowired
    private DisputeService disputeService;

    @GetMapping
    public ResponseEntity<List<DisputeDTO>> getAllDisputes() {
        try {
            List<DisputeDTO> disputes = disputeService.getAllDisputes();
            return ResponseEntity.ok(disputes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisputeDTO> getDisputeById(@PathVariable Long id) {
        try {
            Optional<DisputeDTO> dispute = disputeService.getDisputeById(id);
            return dispute.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createDispute(@Valid @RequestBody DisputeDTO disputeDTO) {
        try {
            Dispute createdDispute = disputeService.createDispute(disputeDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDispute);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDispute(@PathVariable Long id, @Valid @RequestBody DisputeDTO disputeDTO) {
        try {
            Optional<Dispute> updatedDispute = disputeService.updateDispute(id, disputeDTO);
            return updatedDispute.map(dispute -> ResponseEntity.ok((Object) dispute))
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
    public ResponseEntity<?> deleteDispute(@PathVariable Long id) {
        try {
            boolean deleted = disputeService.deleteDispute(id);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
