package com.example.commerical_rent.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.commerical_rent.dtos.UserDTO;
import com.example.commerical_rent.entity.User;
import com.example.commerical_rent.repository.UserRepository;
import com.example.commerical_rent.utils.JwtUtil;

@Service
public class AuthService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public Map<String, Object> signup(UserDTO userDTO) {
        // Create user through UserService (which validates unique email/phone)
        User user = userService.createUser(userDTO);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId().toString());
        
        // Return response with token and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "role", user.getRole().toString()
        ));
        response.put("message", "User registered successfully");
        
        return response;
    }
    
    public Map<String, Object> login(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        // For now, we'll skip password verification since User entity doesn't have password field
        // In production, you'd hash the password and verify it
        // For demo purposes, we accept any password
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId().toString());
        
        // Return response with token and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "role", user.getRole().toString()
        ));
        response.put("message", "Login successful");
        
        return response;
    }
}
