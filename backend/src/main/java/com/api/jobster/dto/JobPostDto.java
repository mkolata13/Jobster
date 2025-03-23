package com.api.jobster.dto;

import com.api.jobster.model.JobPost;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link JobPost}
 */
public record JobPostDto(Long id, String companyName, String title, String jobTitle, String jobFunction,
                         String location, String description, Double monthlySalary, String demandedSkills,
                         String experienceLevel, String status, String jobType, String contractType,
                         boolean remote, LocalDateTime creationDate) implements Serializable {
}