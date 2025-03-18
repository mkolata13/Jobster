package com.api.jobster.dto;

import java.io.Serializable;

public record LoginUserDto(String email, String password) implements Serializable {
}
