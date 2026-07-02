package com.arnav.urlshortener.service.impl;

import com.arnav.urlshortener.dto.AuthResponse;
import com.arnav.urlshortener.dto.LoginRequest;
import com.arnav.urlshortener.dto.RegisterRequest;
import com.arnav.urlshortener.entity.User;
import com.arnav.urlshortener.security.JwtService;
import com.arnav.urlshortener.service.AuthService;
import com.arnav.urlshortener.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .build();
        User savedUser = userService.createUser(user);

        // Generate JWT Access Token using email as the subject
        String token = jwtService.generateAccessToken(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate JWT Access Token using email as the subject
        String token = jwtService.generateAccessToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}
