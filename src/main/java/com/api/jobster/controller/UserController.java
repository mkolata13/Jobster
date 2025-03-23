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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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


    @DeleteMapping("/")
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
                        jobSeeker.getRole().name()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(jobSeekerInfoDtos);
    }

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
                    employer.getCompanyWebsite(), employer.getRole().name());
            return ResponseEntity.ok(output);
        } else if (user.getRole() == Role.JOB_SEEKER) {
            JobSeeker jobSeeker = (JobSeeker) user;
            JobSeekerInfoDto output = new JobSeekerInfoDto(jobSeeker.getId(), jobSeeker.getEmail(), jobSeeker.getFirstName(),
                    jobSeeker.getLastName(), jobSeeker.getRole().name());
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
                employer.getCompanyWebsite(), employer.getRole().name());
        return ResponseEntity.ok(employerInfoDto);
    }

    @PatchMapping("/update-job-seeker")
    public ResponseEntity<JobSeekerInfoDto> updateJobSeekerInfo(@RequestBody UpdateJobSeekerDto input) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        JobSeeker jobSeeker = jobSeekerService.updateJobSeekerInfo(currentUser.getId(), input);
        JobSeekerInfoDto jobSeekerInfoDto = new JobSeekerInfoDto(jobSeeker.getId(), jobSeeker.getEmail(), jobSeeker.getFirstName(),
                jobSeeker.getLastName(), jobSeeker.getRole().name());
        return ResponseEntity.ok(jobSeekerInfoDto);
    }

    @PostMapping(path = "/upload-cv", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> uploadCv(@RequestParam("file") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            String filename = jobSeekerService.saveFile(currentUser.getId(), file, "pdf");
            return ResponseEntity.ok("PDF uploaded successfully " + filename);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/download-cv/{filename}")
    public ResponseEntity<byte[]> downloadCv(@PathVariable String filename) {
        try {
            byte[] fileData = jobSeekerService.getFile(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileData);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
