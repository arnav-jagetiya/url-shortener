package com.arnav.urlshortener.service;

import com.arnav.urlshortener.dto.CreateUrlRequest;
import com.arnav.urlshortener.dto.UrlResponse;

import java.util.List;

public interface UrlService {
    UrlResponse shortenUrl(CreateUrlRequest request, String email, String baseUrl);
    String getOriginalUrlAndIncrementClick(String shortCode);
    List<UrlResponse> getUserUrls(String email, String baseUrl);
    void deleteUrl(Long id, String email);
}
