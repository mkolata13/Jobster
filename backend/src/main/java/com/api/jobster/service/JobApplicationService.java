package com.api.jobster.service;

import com.api.jobster.enums.ApplicationStatus;
import com.api.jobster.model.JobApplication;
import com.api.jobster.model.JobPost;
import com.api.jobster.model.JobSeeker;
import com.api.jobster.repository.JobApplicationRepository;
import com.api.jobster.repository.JobPostRepository;
import com.api.jobster.repository.JobSeekerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class JobApplicationService {
    private final JobApplicationRepository jobApplicationRepository;
    private final JobPostRepository jobPostRepository;
    private final JobSeekerRepository jobSeekerRepository;

    public List<JobApplication> findJobSeekerJobApplications(JobSeeker jobSeeker) {
        Optional<List<JobApplication>> jobApplications = jobApplicationRepository.findByJobSeeker(jobSeeker);
        return jobApplications.orElseGet(ArrayList::new);
    }

    @Transactional
    public JobApplication createJobApplication(Long jobPostId, Long jobSeekerId) {
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new RuntimeException("JobPost does not exist!"));

        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new RuntimeException("JobSeeker does not exist!"));

        if (jobApplicationRepository.existsByJobSeekerAndJobPost(jobSeeker, jobPost)) {
            throw new RuntimeException("User has already applied to this job post!");
        }

        JobApplication jobApplication = new JobApplication();
        jobApplication.setJobSeeker(jobSeeker);
        jobApplication.setJobPost(jobPost);
        jobApplication.setCvPath(jobSeeker.getCvPath());

        return jobApplicationRepository.save(jobApplication);
    }

    public JobApplication updateStatus(Long employerId, Long jobApplicationId, String newStatus) {
        JobApplication jobApplication = jobApplicationRepository.findById(jobApplicationId)
                .orElseThrow(() -> new RuntimeException("JobApplication not found"));

        JobPost jobPost = jobApplication.getJobPost();
        if (!jobPost.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("You are not the owner of this job post");
        }

        if (jobApplication.getApplicationStatus() == ApplicationStatus.ACCEPTED || jobApplication.getApplicationStatus() == ApplicationStatus.REJECTED) {
            throw new RuntimeException("Application status is final.");
        }

        switch (newStatus) {
            case "ACCEPTED" -> jobApplication.setApplicationStatus(ApplicationStatus.ACCEPTED);
            case "REJECTED" -> jobApplication.setApplicationStatus(ApplicationStatus.REJECTED);
            default -> throw new RuntimeException("Invalid status provided");
        }

        return jobApplicationRepository.save(jobApplication);
    }
}
