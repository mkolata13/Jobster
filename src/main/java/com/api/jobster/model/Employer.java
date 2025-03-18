package com.api.jobster.model;

import com.api.jobster.enums.Role;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "employers")
public class Employer extends User {
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_website")
    private String companyWebsite;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<JobPost> jobPosts = new ArrayList<>();

    public Employer() {
        this.setRole(Role.EMPLOYER);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("companyName", companyName)
                .append("companyWebsite", companyWebsite)
                .toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof Employer employer)) return false;

        return new EqualsBuilder().append(companyName, employer.companyName).append(companyWebsite, employer.companyWebsite).append(jobPosts, employer.jobPosts).isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(companyName).append(companyWebsite).append(jobPosts).toHashCode();
    }
}
