package com.api.jobster.service;

import com.api.jobster.dto.UpdateEmployerDto;
import com.api.jobster.model.Employer;
import com.api.jobster.repository.EmployerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class EmployerService {
    private EmployerRepository employerRepository;

    public Employer updateEmployerInfo(Long employerId, UpdateEmployerDto dto) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        employer.setCompanyName(dto.companyName());
        employer.setCompanyWebsite(dto.companyWebsite());

        return employerRepository.save(employer);
    }
}
