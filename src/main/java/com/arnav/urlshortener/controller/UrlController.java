package com.arnav.urlshortener.controller;

import com.arnav.urlshortener.dto.CreateUrlRequest;
import com.arnav.urlshortener.dto.UrlResponse;
import com.arnav.urlshortener.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @PostMapping("/create")
    public ResponseEntity<UrlResponse> shortenUrl(
            @Valid @RequestBody CreateUrlRequest request,
            Principal principal,
            HttpServletRequest servletRequest) {

        String email = principal.getName();
        String baseUrl = getBaseUrl(servletRequest);
        return new ResponseEntity<>(urlService.shortenUrl(request, email, baseUrl), HttpStatus.CREATED);
    }

    @GetMapping("/my-urls")
    public ResponseEntity<List<UrlResponse>> getUserUrls(
            Principal principal,
            HttpServletRequest servletRequest) {

        String email = principal.getName();
        String baseUrl = getBaseUrl(servletRequest);
        return ResponseEntity.ok(urlService.getUserUrls(email, baseUrl));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUrl(
            @PathVariable Long id,
            Principal principal) {

        String email = principal.getName();
        urlService.deleteUrl(id, email);
        return ResponseEntity.noContent().build();
    }

    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        
        StringBuilder url = new StringBuilder();
        url.append(scheme).append("://").append(serverName);
        
        if (("http".equals(scheme) && serverPort != 80) || ("https".equals(scheme) && serverPort != 443)) {
            url.append(":").append(serverPort);
        }
        
        return url.toString();
    }
}
