package com.api.jobster.service;

import com.api.jobster.dto.UpdateJobSeekerDto;
import com.api.jobster.model.JobSeeker;
import com.api.jobster.repository.JobSeekerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@AllArgsConstructor
@Service
public class JobSeekerService {
    JobSeekerRepository jobSeekerRepository;

    public JobSeeker updateJobSeekerInfo(Long jobSeekerId, UpdateJobSeekerDto dto) {
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new RuntimeException("JobSeeker not found"));

        jobSeeker.setFirstName(dto.firstName());
        jobSeeker.setLastName(dto.lastName());

        return jobSeekerRepository.save(jobSeeker);
    }

    public JobSeeker uploadCv(Long jobSeekerId, MultipartFile file) throws IOException {
        Optional<JobSeeker> optionalJobSeeker = jobSeekerRepository.findById(jobSeekerId);
        if (!optionalJobSeeker.isPresent()) {
            throw new RuntimeException("JobSeeker not found");
        } else {
            JobSeeker jobSeeker1 = optionalJobSeeker.get();
            jobSeeker1.setCv(file.getBytes());
            return jobSeekerRepository.save(jobSeeker1);
        }
    }
}
