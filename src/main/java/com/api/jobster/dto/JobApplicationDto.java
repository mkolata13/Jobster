package com.api.jobster.dto;

import com.api.jobster.enums.ApplicationStatus;
import com.api.jobster.model.JobApplication;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link JobApplication}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record JobApplicationDto(
        Long id,
        Long jobPostId,
        Long jobSeekerId,
        ApplicationStatus applicationStatus,
        String companyName,
        String title,
        String jobTitle,
        String firstName,
        String lastName,
        LocalDateTime applicationDate) implements Serializable {
}