package com.arnav.urlshortener.service;

import com.arnav.urlshortener.entity.User;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    boolean existsByEmail(String email);
}
