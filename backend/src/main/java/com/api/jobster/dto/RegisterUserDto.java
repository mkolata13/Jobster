package com.api.jobster.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

/**
 * DTO for {@link com.api.jobster.model.User}
 */
public record RegisterUserDto(
        @Email @NotBlank String email,
        @Min(4) String password,
        String role
) implements Serializable {}