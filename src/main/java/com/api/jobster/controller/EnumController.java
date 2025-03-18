package com.api.jobster.controller;

import com.api.jobster.enums.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/enums")
public class EnumController {

    @GetMapping("/application-status")
    public ApplicationStatus[] getApplicationStatus() {
        return ApplicationStatus.values();
    }

    @GetMapping("/contract-type")
    public ContractType[] getContractType() {
        return ContractType.values();
    }

    @GetMapping("/experience-level")
    public ExperienceLevel[] getExperienceLevel() {
        return ExperienceLevel.values();
    }

    @GetMapping("/job-post-status")
    public JobPostStatus[] getJobPostStatus() {
        return JobPostStatus.values();
    }

    @GetMapping("/job-type")
    public JobType[] getJobType() {
        return JobType.values();
    }

    @GetMapping("/role")
    public Role[] getRole() {
        return Role.values();
    }
}