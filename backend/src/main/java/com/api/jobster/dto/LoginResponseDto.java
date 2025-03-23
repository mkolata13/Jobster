package com.api.jobster.dto;

public record LoginResponseDto(String token, long expiresIn) {
}
