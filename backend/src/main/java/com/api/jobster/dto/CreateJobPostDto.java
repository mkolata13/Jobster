package com.api.jobster.dto;

import com.api.jobster.enums.ContractType;
import com.api.jobster.enums.ExperienceLevel;
import com.api.jobster.enums.JobType;

import java.io.Serializable;

/**
 * DTO for {@link com.api.jobster.model.JobPost}
 */
public record CreateJobPostDto(String title, String jobTitle, String jobFunction, String location,
                               String description, Double monthlySalary, String demandedSkills,
                               ExperienceLevel experienceLevel, JobType jobType, ContractType contractType,
                               Boolean remote) implements Serializable {
}