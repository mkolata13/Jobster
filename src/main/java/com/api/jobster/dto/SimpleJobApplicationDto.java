package com.api.jobster.dto;

import com.api.jobster.enums.ApplicationStatus;
import com.api.jobster.model.JobSeeker;

import java.io.Serializable;
import java.time.LocalDateTime;

public record SimpleJobApplicationDto(
        Long id,
        JobSeeker jobSeeker,
        ApplicationStatus applicationStatus,
        LocalDateTime applicationDate
) implements Serializable {}
