package com.api.jobster.dto;

import java.io.Serializable;

/**
 * DTO for {@link com.api.jobster.model.Employer}
 */
public record EmployerInfoDto(Long id, String email, String companyName, String companyWebsite, String role) implements Serializable {
}