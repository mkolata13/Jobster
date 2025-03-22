package com.api.jobster.dto;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.Serializable;

public record UpdateJobSeekerDto(
        @Min(4) @Max(25) String firstName,
        @Min(4) @Max(25) String lastName
) implements Serializable {}
