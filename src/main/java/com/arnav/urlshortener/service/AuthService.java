package com.arnav.urlshortener.service;

import com.arnav.urlshortener.dto.AuthResponse;
import com.arnav.urlshortener.dto.LoginRequest;
import com.arnav.urlshortener.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
