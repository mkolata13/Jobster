package com.api.jobster.service;

import com.api.jobster.dto.UpdateJobSeekerDto;
import com.api.jobster.model.JobSeeker;
import com.api.jobster.repository.JobSeekerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class JobSeekerService {
    JobSeekerRepository jobSeekerRepository;

    public JobSeeker updateJobSeekerInfo(Long jobSeekerId, UpdateJobSeekerDto dto) {
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new RuntimeException("JobSeeker not found"));

        jobSeeker.setCv(dto.cv());
        jobSeeker.setFirstName(dto.firstName());
        jobSeeker.setLastName(dto.lastName());

        return jobSeekerRepository.save(jobSeeker);
    }
}
