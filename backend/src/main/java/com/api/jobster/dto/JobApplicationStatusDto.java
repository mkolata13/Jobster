package com.api.jobster.dto;

import java.io.Serializable;

public record JobApplicationStatusDto(
        String status
) implements Serializable {}
