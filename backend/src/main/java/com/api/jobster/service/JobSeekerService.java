package com.api.jobster.service;

import com.api.jobster.dto.UpdateJobSeekerDto;
import com.api.jobster.model.JobSeeker;
import com.api.jobster.repository.JobSeekerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.UUID;

@Service
public class JobSeekerService {
    JobSeekerRepository jobSeekerRepository;
    private final Path rootLocation = Paths.get("uploads");

    public JobSeekerService(JobSeekerRepository jobSeekerRepository) throws IOException {
        this.jobSeekerRepository = jobSeekerRepository;
        if (!Files.exists(rootLocation)) {
            Files.createDirectory(rootLocation);
        }
    }

    public String saveFile(Long jobSeekerId, MultipartFile file, String fileType) throws IOException {
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new RuntimeException("JobSeeker not found"));

        String extension = getFileExtension(Objects.requireNonNull(file.getOriginalFilename()));
        String filename = UUID.randomUUID() + "." + extension;

        if (fileType.equalsIgnoreCase("pdf") && !"pdf".equalsIgnoreCase(extension)) {
            throw new IOException("Invalid PDF file type.");
        }

        Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
        jobSeeker.setCvPath(filename);
        jobSeekerRepository.save(jobSeeker);
        return filename;
    }

    public byte[] getFile(String filename) throws IOException {
        Path filePath = this.rootLocation.resolve(filename);
        return Files.readAllBytes(filePath);
    }

    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public JobSeeker updateJobSeekerInfo(Long jobSeekerId, UpdateJobSeekerDto dto) {
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new RuntimeException("JobSeeker not found"));

        jobSeeker.setFirstName(dto.firstName());
        jobSeeker.setLastName(dto.lastName());

        return jobSeekerRepository.save(jobSeeker);
    }
}
