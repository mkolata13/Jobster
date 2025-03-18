package com.api.jobster.repository;

import com.api.jobster.model.JobApplication;
import com.api.jobster.model.JobSeeker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    Optional<List<JobApplication>> findByJobSeeker(JobSeeker jobSeeker);
}