package com.api.jobster.service;

import com.api.jobster.dto.LoginUserDto;
import com.api.jobster.dto.RegisterUserDto;
import com.api.jobster.dto.VerifyUserDto;
import com.api.jobster.enums.Role;
import com.api.jobster.model.User;
import com.api.jobster.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setVerificationCode("123456");
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(20));
        user.setEnabled(false);
    }

    @Test
    void testSignup_Employer() throws MessagingException {
        // Arrange
        RegisterUserDto registerUserDto = new RegisterUserDto("test@example.com", "password", "EMPLOYER");
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any())).thenReturn(user);
        user.setRole(Role.EMPLOYER);

        // Act
        User savedUser = authService.signup(registerUserDto);

        // Assert
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("test@example.com");
        assertThat(savedUser.getPassword()).isEqualTo("encodedPassword");
        assertThat(savedUser.getRole()).isEqualTo(Role.EMPLOYER);
        assertThat(savedUser.getVerificationCode()).isNotNull();
        assertThat(savedUser.isEnabled()).isFalse();
        verify(userRepository, times(1)).save(any());
        verify(emailService, times(1)).sendVerificationEmail(any(), any(), any());
    }

    @Test
    void testSignup_JobSeeker() throws MessagingException {
        // Arrange
        RegisterUserDto registerUserDto = new RegisterUserDto("test@example.com", "password", "JOB_SEEKER");
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any())).thenReturn(user);
        user.setRole(Role.JOB_SEEKER);

        // Act
        User savedUser = authService.signup(registerUserDto);

        // Assert
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("test@example.com");
        assertThat(savedUser.getPassword()).isEqualTo("encodedPassword");
        assertThat(savedUser.getRole()).isEqualTo(Role.JOB_SEEKER);
        assertThat(savedUser.getVerificationCode()).isNotNull();
        assertThat(savedUser.isEnabled()).isFalse();
        verify(userRepository, times(1)).save(any());
        verify(emailService, times(1)).sendVerificationEmail(any(), any(), any());
    }

    @Test
    void testAuthenticate_Success() {
        // Arrange
        LoginUserDto loginUserDto = new LoginUserDto("test@example.com", "password");
        user.setEnabled(true);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any())).thenReturn(null);

        // Act
        User authenticatedUser = authService.authenticate(loginUserDto);

        // Assert
        assertThat(authenticatedUser).isNotNull();
        assertThat(authenticatedUser.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void testAuthenticate_UserNotFound() {
        // Arrange
        LoginUserDto loginUserDto = new LoginUserDto("test@example.com", "password");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.authenticate(loginUserDto))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("test@example.com not found!");
    }

    @Test
    void testAuthenticate_AccountNotVerified() {
        // Arrange
        LoginUserDto loginUserDto = new LoginUserDto("test@example.com", "password");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(() -> authService.authenticate(loginUserDto))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("Account test@example.com is not verified!");
    }

    @Test
    void testVerifyUser_Success() {
        // Arrange
        VerifyUserDto verifyUserDto = new VerifyUserDto("test@example.com", "123456");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // Act
        authService.verifyUser(verifyUserDto);

        // Assert
        assertThat(user.isEnabled()).isTrue();
        assertThat(user.getVerificationCode()).isNull();
        assertThat(user.getVerificationCodeExpiresAt()).isNull();
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testResendVerificationCode_Success() throws MessagingException {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // Act
        authService.resendVerificationCode("test@example.com");

        // Assert
        assertThat(user.getVerificationCode()).isNotNull();
        assertThat(user.getVerificationCodeExpiresAt()).isAfter(LocalDateTime.now());
        verify(userRepository, times(1)).save(user);
        verify(emailService, times(1)).sendVerificationEmail(any(), any(), any());
    }
}