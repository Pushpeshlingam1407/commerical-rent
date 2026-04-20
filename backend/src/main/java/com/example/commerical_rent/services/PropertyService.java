package com.example.commerical_rent.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.commerical_rent.dtos.PropertyDTO;
import com.example.commerical_rent.entity.Property;
import com.example.commerical_rent.entity.User;
import com.example.commerical_rent.repository.PropertyRepository;
import com.example.commerical_rent.repository.UserRepository;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<PropertyDTO> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<PropertyDTO> getPropertyById(Long id) {
        return propertyRepository.findById(id).map(this::convertToDTO);
    }

    public Property createProperty(PropertyDTO propertyDTO) {
        // Fetch owner
        User owner = userRepository.findById(propertyDTO.getOwnerId())
                .orElseThrow(() -> new IllegalArgumentException("Owner not found"));
        
        Property property = new Property();
        property.setPropertyName(propertyDTO.getPropertyName());
        property.setLocation(propertyDTO.getLocation());
        property.setPropertyType(propertyDTO.getPropertyType());
        property.setMonthlyRentAmount(propertyDTO.getMonthlyRentAmount());
        property.setOwner(owner);
        property.setAvailabilityStatus(propertyDTO.getAvailabilityStatus());
        property.setCreatedAt(LocalDateTime.now());
        
        return propertyRepository.save(property);
    }

    public Optional<Property> updateProperty(Long id, PropertyDTO propertyDTO) {
        Optional<Property> existingProperty = propertyRepository.findById(id);
        
        if (existingProperty.isPresent()) {
            Property property = existingProperty.get();
            
            property.setPropertyName(propertyDTO.getPropertyName());
            property.setLocation(propertyDTO.getLocation());
            property.setPropertyType(propertyDTO.getPropertyType());
            property.setMonthlyRentAmount(propertyDTO.getMonthlyRentAmount());
            
            if (propertyDTO.getOwnerId() != null) {
                User owner = userRepository.findById(propertyDTO.getOwnerId())
                        .orElseThrow(() -> new IllegalArgumentException("Owner not found"));
                property.setOwner(owner);
            }
            
            property.setAvailabilityStatus(propertyDTO.getAvailabilityStatus());
            
            return Optional.of(propertyRepository.save(property));
        }
        
        return Optional.empty();
    }

    public boolean deleteProperty(Long id) {
        if (propertyRepository.existsById(id)) {
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private PropertyDTO convertToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setPropertyName(property.getPropertyName());
        dto.setLocation(property.getLocation());
        dto.setPropertyType(property.getPropertyType());
        dto.setMonthlyRentAmount(property.getMonthlyRentAmount());
        dto.setOwnerId(property.getOwner() != null ? property.getOwner().getId() : null);
        dto.setAvailabilityStatus(property.getAvailabilityStatus());
        dto.setCreatedAt(property.getCreatedAt());
        return dto;
    }
}
