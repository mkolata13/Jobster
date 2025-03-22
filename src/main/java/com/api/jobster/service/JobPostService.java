package com.api.jobster.service;

import com.api.jobster.dto.CreateJobPostDto;
import com.api.jobster.dto.JobApplicationDto;
import com.api.jobster.dto.JobPostDto;
import com.api.jobster.enums.ContractType;
import com.api.jobster.enums.ExperienceLevel;
import com.api.jobster.enums.JobPostStatus;
import com.api.jobster.enums.JobType;
import com.api.jobster.model.Employer;
import com.api.jobster.model.JobApplication;
import com.api.jobster.model.JobPost;
import com.api.jobster.repository.EmployerRepository;
import com.api.jobster.repository.JobPostRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class JobPostService {
    private final JobPostRepository jobPostRepository;
    private final EmployerRepository employerRepository;

    public JobPost createJobPost(Long id, CreateJobPostDto input) {
        JobPost jobPost = new JobPost();
        Optional<Employer> optionalEmployer = employerRepository.findById(id);
        if (optionalEmployer.isPresent()) {
            Employer employer = optionalEmployer.get();
            jobPost.setEmployer(employer);
        }
        jobPost.setTitle(input.title());
        jobPost.setJobTitle(input.jobTitle());
        jobPost.setJobFunction(input.jobFunction());
        jobPost.setLocation(input.location());
        jobPost.setDescription(input.description());
        jobPost.setMonthlySalary(input.monthlySalary());
        jobPost.setDemandedSkills(input.demandedSkills());
        jobPost.setExperienceLevel(input.experienceLevel());
        jobPost.setJobType(input.jobType());
        jobPost.setContractType(input.contractType());
        jobPost.setRemote(input.remote());

        return jobPostRepository.save(jobPost);
    }

    public JobPost updateJobPost(Long employerId, Long jobPostId, JobPostDto dto) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new RuntimeException("JobPost not found"));

        if (!jobPost.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("JobPost does not belong to the employer");
        }

        jobPost.setTitle(dto.title());
        jobPost.setJobTitle(dto.jobTitle());
        jobPost.setJobFunction(dto.jobFunction());
        jobPost.setLocation(dto.location());
        jobPost.setDescription(dto.description());
        jobPost.setMonthlySalary(dto.monthlySalary());
        jobPost.setDemandedSkills(dto.demandedSkills());
        jobPost.setExperienceLevel(ExperienceLevel.valueOf(dto.experienceLevel()));
        jobPost.setStatus(JobPostStatus.valueOf(dto.status()));
        jobPost.setJobType(JobType.valueOf(dto.jobType()));
        jobPost.setContractType(ContractType.valueOf(dto.contractType()));
        jobPost.setRemote(dto.remote());

        return jobPostRepository.save(jobPost);
    }

    public JobPost findJobPostById(Long id) {
        return jobPostRepository.findById(id).orElseThrow();
    }

    public List<JobApplication> getAllJobApplications(Long jobPostId, Long employerId) {
        List<JobApplication> jobApplications = new ArrayList<>();
        JobPost jobPost = findJobPostById(jobPostId);
        if (!jobPost.getEmployer().getId().equals(employerId)) {
            throw new RuntimeException("This job post does not belong to your account!");
        }
        return jobPost.getJobApplications();
    }

    public List<JobPost> getAllEmployerJobPosts(Employer employer) {
        Optional<List<JobPost>> optionalJobPosts = jobPostRepository.findByEmployer(employer);
        List<JobPost> jobPosts = new ArrayList<>();
        if (optionalJobPosts.isPresent()) {
            jobPosts = optionalJobPosts.get();
        }
        return jobPosts;
    }

    public List<JobPost> getJobPosts(String status) {
        List<JobPost> optionalJobPosts;
        switch (status) {
            case "active" -> optionalJobPosts = jobPostRepository.findByStatus(JobPostStatus.ACTIVE);
            case "inactive" -> optionalJobPosts = jobPostRepository.findByStatus(JobPostStatus.INACTIVE);
            case "archived" -> optionalJobPosts = jobPostRepository.findByStatus(JobPostStatus.ARCHIVED);
            default -> optionalJobPosts = jobPostRepository.findAll();
        }

        return optionalJobPosts;
    }

    public List<JobPost> getAllJobPosts() {
        return jobPostRepository.findAll();
    }
}
