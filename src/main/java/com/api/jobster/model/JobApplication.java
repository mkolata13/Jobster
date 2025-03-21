package com.api.jobster.model;

import com.api.jobster.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "job_applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_post_id", nullable = false)
    private JobPost jobPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private JobSeeker jobSeeker;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false)
    private ApplicationStatus applicationStatus;

    @Column(name = "application_date")
    private LocalDateTime applicationDate;

    @Lob
    @Column(name = "cv")
    private byte[] cv;

    public JobApplication() {
        this.applicationStatus = ApplicationStatus.PENDING;
        this.applicationDate = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("id", id)
                .append("jobPost", jobPost.toString())
                .append("jobSeeker", jobSeeker.toString())
                .append("applicationStatus", applicationStatus)
                .append("applicationDate", applicationDate)
                .toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof JobApplication that)) return false;

        return new EqualsBuilder().append(id, that.id).append(jobPost, that.jobPost).append(jobSeeker, that.jobSeeker).append(applicationStatus, that.applicationStatus).append(applicationDate, this.applicationDate).isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(id).append(jobPost).append(jobSeeker).append(applicationStatus).append(applicationDate).toHashCode();
    }
}
