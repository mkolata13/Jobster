package com.api.jobster.dto;

import com.api.jobster.enums.ApplicationStatus;
import com.api.jobster.model.JobApplication;
import com.api.jobster.model.JobPost;
import com.api.jobster.model.JobSeeker;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link JobApplication}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record JobApplicationDto(Long id, JobPost jobPost, JobSeeker jobSeeker,
                                ApplicationStatus applicationStatus, LocalDateTime applicationDate) implements Serializable {
}