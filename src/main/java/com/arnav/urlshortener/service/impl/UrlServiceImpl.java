package com.arnav.urlshortener.service.impl;

import com.arnav.urlshortener.dto.CreateUrlRequest;
import com.arnav.urlshortener.dto.UrlResponse;
import com.arnav.urlshortener.entity.ShortUrl;
import com.arnav.urlshortener.entity.User;
import com.arnav.urlshortener.exception.ResourceNotFoundException;
import com.arnav.urlshortener.exception.UrlExpiredException;
import com.arnav.urlshortener.repository.ShortUrlRepository;
import com.arnav.urlshortener.service.UrlService;
import com.arnav.urlshortener.service.UserService;
import com.arnav.urlshortener.util.Base62Util;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlServiceImpl implements UrlService {

    private final ShortUrlRepository shortUrlRepository;
    private final UserService userService;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional
    public UrlResponse shortenUrl(CreateUrlRequest request, String email, String baseUrl) {
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        LocalDateTime expiresAt = null;
        if (request.getExpirationMinutes() != null && request.getExpirationMinutes() > 0) {
            expiresAt = LocalDateTime.now().plusMinutes(request.getExpirationMinutes());
        }

        String shortCode;
        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            String alias = request.getCustomAlias().trim();
            
            // Validate: alphanumeric, hyphen, underscore, 3-30 chars
            if (!alias.matches("^[a-zA-Z0-9_-]{3,30}$")) {
                throw new IllegalArgumentException("Custom alias must be 3-30 characters long and contain only alphanumeric characters, hyphens, or underscores");
            }
            
            if (shortUrlRepository.existsByShortCode(alias)) {
                throw new IllegalArgumentException("Custom alias is already in use: " + alias);
            }
            
            shortCode = alias;
            
            ShortUrl shortUrl = ShortUrl.builder()
                    .originalUrl(request.getOriginalUrl())
                    .shortCode(shortCode)
                    .user(user)
                    .expiresAt(expiresAt)
                    .build();
            
            shortUrl = shortUrlRepository.save(shortUrl);
            return mapToResponse(shortUrl, baseUrl);
        } else {
            // 1. Create a ShortUrl entity with a temporary unique placeholder code
            ShortUrl shortUrl = ShortUrl.builder()
                    .originalUrl(request.getOriginalUrl())
                    .shortCode("TEMP-" + UUID.randomUUID().toString().substring(0, 5))
                    .user(user)
                    .expiresAt(expiresAt)
                    .build();

            // Save first to get the database ID
            shortUrl = shortUrlRepository.save(shortUrl);

            // 2. Generate Base62 code from database ID
            shortCode = Base62Util.encode(shortUrl.getId());
            shortUrl.setShortCode(shortCode);

            // Update with the final short code
            shortUrl = shortUrlRepository.save(shortUrl);

            return mapToResponse(shortUrl, baseUrl);
        }
    }

    @Override
    @Transactional
    public String getOriginalUrlAndIncrementClick(String shortCode) {
        String cacheKey = "shorturl:" + shortCode;
        String cachedUrl = redisTemplate.opsForValue().get(cacheKey);

        if (cachedUrl != null) {
            // Cache hit: Increment click count
            shortUrlRepository.incrementClickCount(shortCode);
            return cachedUrl;
        }

        // Cache miss:
        ShortUrl shortUrl = shortUrlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found for code: " + shortCode));

        // Check expiration
        if (shortUrl.getExpiresAt() != null && shortUrl.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UrlExpiredException("Short URL has expired");
        }

        // Increment click count
        shortUrl.setClickCount(shortUrl.getClickCount() + 1);
        shortUrlRepository.save(shortUrl);

        // Store result in Redis
        redisTemplate.opsForValue().set(cacheKey, shortUrl.getOriginalUrl(), 24, TimeUnit.HOURS);

        return shortUrl.getOriginalUrl();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UrlResponse> getUserUrls(String email, String baseUrl) {
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        List<ShortUrl> urls = shortUrlRepository.findByUserId(user.getId());
        return urls.stream()
                .map(url -> mapToResponse(url, baseUrl))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUrl(Long id, String email) {
        ShortUrl shortUrl = shortUrlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found with id: " + id));

        // Verify ownership
        if (!shortUrl.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to delete this URL");
        }

        shortUrlRepository.delete(shortUrl);

        // Evict from Redis cache
        redisTemplate.delete("shorturl:" + shortUrl.getShortCode());
    }

    private UrlResponse mapToResponse(ShortUrl shortUrl, String baseUrl) {
        String cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
        return UrlResponse.builder()
                .originalUrl(shortUrl.getOriginalUrl())
                .shortCode(shortUrl.getShortCode())
                .shortUrl(cleanBaseUrl + shortUrl.getShortCode())
                .clickCount(shortUrl.getClickCount())
                .createdAt(shortUrl.getCreatedAt())
                .expiresAt(shortUrl.getExpiresAt())
                .build();
    }
}
