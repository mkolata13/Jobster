package com.api.jobster.model;

import com.api.jobster.enums.Role;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "job_seekers")
public class JobSeeker extends User {
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "cv")
    private String cvPath;

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<JobApplication> jobApplications;

    public JobSeeker() {
        this.setRole(Role.JOB_SEEKER);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("firstName", firstName)
                .append("lastName", lastName)
                .append("cv", cvPath)
                .toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof JobSeeker jobSeeker)) return false;

        return new EqualsBuilder().append(firstName, jobSeeker.firstName).append(lastName, jobSeeker.lastName).append(cvPath, jobSeeker.cvPath).append(jobApplications, jobSeeker.jobApplications).isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(firstName).append(lastName).append(cvPath).append(jobApplications).toHashCode();
    }
}
