package com.api.jobster.dto;

import java.io.Serializable;

/**
 * DTO for {@link com.api.jobster.model.JobSeeker}
 */
public record JobSeekerInfoDto(Long id, String email, String firstName, String lastName,
                               String role) implements Serializable {
}