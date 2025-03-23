package com.api.jobster.dto;

import com.api.jobster.model.User;

import java.io.Serializable;

/**
 * DTO for {@link User}
 */
public record UserDto(
        Long id,
        String email,
        String role
) implements Serializable {}