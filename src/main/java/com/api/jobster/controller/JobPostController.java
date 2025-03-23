package com.api.jobster.controller;

import com.api.jobster.dto.CreateJobPostDto;
import com.api.jobster.dto.JobPostDto;
import com.api.jobster.model.Employer;
import com.api.jobster.model.JobApplication;
import com.api.jobster.dto.JobApplicationDto;
import com.api.jobster.model.JobPost;
import com.api.jobster.model.User;
import com.api.jobster.service.JobApplicationService;
import com.api.jobster.service.JobPostService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@RequestMapping("/job-posts")
@RestController
public class JobPostController {
    private JobPostService jobPostService;
    private JobApplicationService jobApplicationService;

    @GetMapping("/")
    public ResponseEntity<List<JobPostDto>> getAllJobPosts() {
        List<JobPost> jobPosts = jobPostService.getAllJobPosts();
        if (jobPosts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<JobPostDto> jobPostDtos = jobPosts.stream()
                .map(this::convertToJobPostDto)
                .toList();

        return ResponseEntity.ok(jobPostDtos);
    }

    @PostMapping("/")
    public ResponseEntity<JobPostDto> createJobPost(@RequestBody CreateJobPostDto createJobPostDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        JobPost jobPost = jobPostService.createJobPost(currentUser.getId(), createJobPostDto);
        JobPostDto jobPostDto = convertToJobPostDto(jobPost);
        return ResponseEntity.ok(jobPostDto);
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobPostDto>> myJobPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Employer employer = (Employer) currentUser;
        List<JobPost> jobPosts = jobPostService.getAllEmployerJobPosts(employer);
        if (jobPosts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        List<JobPostDto> jobPostDtos = new ArrayList<>();
        for (JobPost jobPost : jobPosts) {
            JobPostDto jobPostDto = convertToJobPostDto(jobPost);
            jobPostDtos.add(jobPostDto);
        }

        return ResponseEntity.ok(jobPostDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostDto> getJobPost(@PathVariable Long id) {
        JobPost jobPost = jobPostService.findJobPostById(id);
        JobPostDto jobPostDto = convertToJobPostDto(jobPost);

        return ResponseEntity.ok(jobPostDto);
    }

    @PostMapping("/{id}")
    public ResponseEntity<JobApplicationDto> applyForJobPost(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        JobApplication jobApplication = jobApplicationService.createJobApplication(id, currentUser.getId());
        JobApplicationDto result = jobApplicationToDto(jobApplication);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPostDto> updateJobPost(@PathVariable Long id, @RequestBody JobPostDto input) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        JobPost jobPost = jobPostService.updateJobPost(currentUser.getId(), id, input);
        JobPostDto jobPostDto = convertToJobPostDto(jobPost);
        return ResponseEntity.ok(jobPostDto);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<JobPostDto>> getActiveJobPosts(@PathVariable String status) {
        List<JobPost> jobPosts = jobPostService.getJobPosts(status);

        List<JobPostDto> jobPostDtos = jobPosts.stream()
                .map(this::convertToJobPostDto)
                .toList();

        return ResponseEntity.ok(jobPostDtos);
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<List<JobApplicationDto>> getApplicationsForJobPost(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Employer employer = (Employer) currentUser;
        List<JobApplication> jobApplications = jobPostService.getAllJobApplications(id, employer.getId());
        List<JobApplicationDto> jobApplicationDtos = new ArrayList<>();
        for (JobApplication jobApplication : jobApplications) {
            JobApplicationDto jobApplicationDto = jobApplicationToDto(jobApplication);
            jobApplicationDtos.add(jobApplicationDto);
        }

        return ResponseEntity.ok(jobApplicationDtos);
    }

    private JobPostDto convertToJobPostDto(JobPost jobPost) {
        return new JobPostDto(
                jobPost.getId(),
                jobPost.getEmployer().getCompanyName(),
                jobPost.getTitle(),
                jobPost.getJobTitle(),
                jobPost.getJobFunction(),
                jobPost.getLocation(),
                jobPost.getDescription(),
                jobPost.getMonthlySalary(),
                jobPost.getDemandedSkills(),
                jobPost.getExperienceLevel().name(),
                jobPost.getStatus().name(),
                jobPost.getJobType().name(),
                jobPost.getContractType().name(),
                jobPost.isRemote(),
                jobPost.getCreationDate()
        );
    }

    public static JobApplicationDto jobApplicationToDto(JobApplication jobApplication) {
        if (jobApplication == null) {
            return null;
        }

        return new JobApplicationDto(
                jobApplication.getId(),
                jobApplication.getJobPost().getId(),
                jobApplication.getJobSeeker().getId(),
                jobApplication.getApplicationStatus(),
                jobApplication.getJobPost().getEmployer().getCompanyName(),
                jobApplication.getJobPost().getTitle(),
                jobApplication.getJobPost().getJobTitle(),
                jobApplication.getJobSeeker().getFirstName(),
                jobApplication.getJobSeeker().getLastName(),
                jobApplication.getCvPath(),
                jobApplication.getApplicationDate()
        );
    }
}
