package com.example.issuetracker.dto;

import com.example.issuetracker.entity.IssuePriority;
import com.example.issuetracker.entity.IssueStatus;
import java.time.Instant;
import java.util.List;

public record IssueResponse(
    Long id, String title, String description,
    IssueStatus status, IssuePriority priority,
    Instant createdAt, Instant updatedAt,
    List<AttachmentResponse> attachments
) {}
