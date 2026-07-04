package com.arnav.urlshortener.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlResponse {
    private Long id;
    private String originalUrl;
    private String shortUrl;
    private String shortCode;
    private long clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
