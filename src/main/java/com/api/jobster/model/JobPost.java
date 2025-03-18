package com.api.jobster.model;

import com.api.jobster.enums.ContractType;
import com.api.jobster.enums.ExperienceLevel;
import com.api.jobster.enums.JobPostStatus;
import com.api.jobster.enums.JobType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import java.time.LocalDateTime;
import java.util.List;


@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "job_posts")
public class JobPost {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @OneToMany(mappedBy = "jobPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobApplication> jobApplications;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "job_function", nullable = false)
    private String jobFunction;

    @Column(name = "location")
    private String location;

    @Column(name = "description")
    private String description;

    @Column(name = "monthly_salary")
    private Double monthlySalary;

    @Column(name = "demanded_skills")
    private String demandedSkills;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level")
    private ExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private JobPostStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type")
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type")
    private ContractType contractType;

    @Column(name = "remote")
    private boolean remote;

    @Column(name = "creation_date")
    private LocalDateTime creationDate;

    public JobPost() {
        this.status = JobPostStatus.ACTIVE;
        this.creationDate = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("id", id)
                .append("employer", employer)
                .append("jobApplications", jobApplications)
                .append("title", title)
                .append("jobTitle", jobTitle)
                .append("jobFunction", jobFunction)
                .append("location", location)
                .append("description", description)
                .append("monthlySalary", monthlySalary)
                .append("demandedSkills", demandedSkills)
                .append("experienceLevel", experienceLevel)
                .append("status", status)
                .append("jobType", jobType)
                .append("contractType", contractType)
                .append("remote", remote)
                .append("creationDate", creationDate)
                .toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof JobPost jobPost)) return false;

        return new EqualsBuilder().append(remote, jobPost.remote).append(id, jobPost.id).append(employer, jobPost.employer).append(jobApplications, jobPost.jobApplications).append(title, jobPost.title).append(jobTitle, jobPost.jobTitle).append(jobFunction, jobPost.jobFunction).append(location, jobPost.location).append(description, jobPost.description).append(monthlySalary, jobPost.monthlySalary).append(demandedSkills, jobPost.demandedSkills).append(experienceLevel, jobPost.experienceLevel).append(status, jobPost.status).append(jobType, jobPost.jobType).append(contractType, jobPost.contractType).append(creationDate, jobPost.creationDate).isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(id).append(employer).append(jobApplications).append(title).append(jobTitle).append(jobFunction).append(location).append(description).append(monthlySalary).append(demandedSkills).append(experienceLevel).append(status).append(jobType).append(contractType).append(remote).append(creationDate).toHashCode();
    }
}
