package com.api.jobster.controller;


import com.api.jobster.dto.*;
import com.api.jobster.enums.Role;
import com.api.jobster.model.Employer;
import com.api.jobster.model.JobSeeker;
import com.api.jobster.model.User;
import com.api.jobster.repository.UserRepository;
import com.api.jobster.service.EmployerService;
import com.api.jobster.service.JobSeekerService;
import com.api.jobster.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;
    private final JobSeekerService jobSeekerService;
    private final EmployerService employerService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        User user = userRepository.findById(currentUser.getId()).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (user.getRole() == Role.EMPLOYER) {
            Employer employer = (Employer) user;
            EmployerInfoDto output = new EmployerInfoDto(employer.getId(), employer.getEmail(), employer.getCompanyName(),
                    employer.getCompanyWebsite(), employer.getJobPosts().toString(), employer.getRole().name());
            return ResponseEntity.ok(output);
        } else if (user.getRole() == Role.JOB_SEEKER) {
            JobSeeker jobSeeker = (JobSeeker) user;
            JobSeekerInfoDto output = new JobSeekerInfoDto(jobSeeker.getId(), jobSeeker.getEmail(), jobSeeker.getFirstName(),
                    jobSeeker.getLastName(), jobSeeker.getCv(), jobSeeker.getJobApplications().toString(),
                    jobSeeker.getRole().name());
            return ResponseEntity.ok(output);
        }

        return ResponseEntity.ok(user);
    }

    @PatchMapping("/update-employer")
    public ResponseEntity<EmployerInfoDto> updateEmployerInfo(@RequestBody UpdateEmployerDto input) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Employer employer = employerService.updateEmployerInfo(currentUser.getId(), input);
        EmployerInfoDto employerInfoDto = new EmployerInfoDto(employer.getId(), employer.getEmail(), employer.getCompanyName(),
                employer.getCompanyWebsite(), employer.getJobPosts().toString(), employer.getRole().name());
        return ResponseEntity.ok(employerInfoDto);
    }

    @PatchMapping("/update-job-seeker")
    public ResponseEntity<JobSeekerInfoDto> updateJobSeekerInfo(@RequestBody UpdateJobSeekerDto input) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        JobSeeker jobSeeker = jobSeekerService.updateJobSeekerInfo(currentUser.getId(), input);
        JobSeekerInfoDto jobSeekerInfoDto = new JobSeekerInfoDto(jobSeeker.getId(), jobSeeker.getEmail(), jobSeeker.getFirstName(),
                jobSeeker.getLastName(), jobSeeker.getCv(), jobSeeker.getJobApplications().toString(), jobSeeker.getRole().name());
        return ResponseEntity.ok(jobSeekerInfoDto);
    }

    @GetMapping("/employers")
    public ResponseEntity<List<EmployerInfoDto>> getEmployers() {
        List<Employer> employers = userService.allUsersByRole(Role.EMPLOYER).stream()
                .map(user -> (Employer) user)
                .toList();

        List<EmployerInfoDto> employerInfoDtos = employers.stream()
                .map(employer -> new EmployerInfoDto(
                        employer.getId(),
                        employer.getEmail(),
                        employer.getCompanyName(),
                        employer.getCompanyWebsite(),
                        employer.getJobPosts().toString(),
                        employer.getRole().name()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(employerInfoDtos);
    }

    @GetMapping("/job-seekers")
    public ResponseEntity<List<JobSeekerInfoDto>> getJobSeekers() {
        List<JobSeeker> jobSeekers = userService.allUsersByRole(Role.JOB_SEEKER).stream()
                .map(user -> (JobSeeker) user)
                .toList();

        List<JobSeekerInfoDto> jobSeekerInfoDtos = jobSeekers.stream()
                .map(jobSeeker -> new JobSeekerInfoDto(
                        jobSeeker.getId(),
                        jobSeeker.getEmail(),
                        jobSeeker.getFirstName(),
                        jobSeeker.getLastName(),
                        jobSeeker.getCv(),
                        jobSeeker.getJobApplications().toString(),
                        jobSeeker.getRole().name()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(jobSeekerInfoDtos);
    }

    @GetMapping("/")
    public ResponseEntity<List<UserDto>> allUsers() {
        List<User> users = userService.allUsers();
        List<UserDto> userDtos = users.stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<UserDto> deleteUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user != null) {
            userService.deleteUser(user);
            UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getRole().name());
            return ResponseEntity.ok(userDto);
        }

        return ResponseEntity.notFound().build();
    }
}
