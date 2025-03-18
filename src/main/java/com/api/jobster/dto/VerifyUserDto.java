package com.api.jobster.dto;

import org.springframework.lang.NonNull;

import javax.validation.constraints.Email;
import java.io.Serializable;

public record VerifyUserDto(
        @NonNull @Email String email,
        @NonNull String verificationCode
) implements Serializable {}
