package com.example.issuetracker.dto;

import com.example.issuetracker.entity.IssuePriority;
import com.example.issuetracker.entity.IssueStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IssueRequest(
    @NotBlank @Size(max = 150) String title,
    @NotBlank String description,
    IssueStatus status,
    IssuePriority priority
) {}
