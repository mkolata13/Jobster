package com.api.jobster.controller;

import com.api.jobster.dto.JobApplicationDto;
import com.api.jobster.dto.JobApplicationStatusDto;
import com.api.jobster.model.*;
import com.api.jobster.service.JobApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/job-applications")
public class JobApplicationController {
    private JobApplicationService jobApplicationService;

    @PatchMapping("/{id}")
    public ResponseEntity<JobApplicationDto> updateStatus(
            @PathVariable Long id,
            @RequestBody JobApplicationStatusDto status
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Employer employer = (Employer) currentUser;
        JobApplication jobApplication = jobApplicationService.updateStatus(employer.getId(), id, status.status());
        JobApplicationDto jobApplicationDto = new JobApplicationDto(jobApplication.getId(), jobApplication.getJobPost(),
                jobApplication.getJobSeeker(), jobApplication.getApplicationStatus(), jobApplication.getApplicationDate());

        return ResponseEntity.ok(jobApplicationDto);
    }

    @GetMapping("/")
    public ResponseEntity<List<JobApplicationDto>> getAllJobApplications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        JobSeeker jobSeeker = (JobSeeker) currentUser;
        List<JobApplication> jobApplications = jobApplicationService.findJobSeekerJobApplications(jobSeeker);
        List<JobApplicationDto> jobApplicationDtos = new ArrayList<>();
        for (JobApplication jobApplication : jobApplications) {
            JobApplicationDto dto = new JobApplicationDto(jobApplication.getId(), jobApplication.getJobPost(),
                    jobApplication.getJobSeeker(), jobApplication.getApplicationStatus(), jobApplication.getApplicationDate());
            jobApplicationDtos.add(dto);
        }

        return new ResponseEntity<>(jobApplicationDtos, HttpStatus.OK);
    }
}
