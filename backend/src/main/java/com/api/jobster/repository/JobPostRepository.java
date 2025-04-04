package com.api.jobster.repository;

import com.api.jobster.enums.JobPostStatus;
import com.api.jobster.model.Employer;
import com.api.jobster.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    Optional<List<JobPost>> findByEmployer(Employer employer);
    List<JobPost> findByStatus(JobPostStatus status);
}
