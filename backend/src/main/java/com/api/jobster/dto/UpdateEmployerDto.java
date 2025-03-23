package com.api.jobster.dto;

import java.io.Serializable;

public record UpdateEmployerDto(String companyName, String companyWebsite) implements Serializable {
}
