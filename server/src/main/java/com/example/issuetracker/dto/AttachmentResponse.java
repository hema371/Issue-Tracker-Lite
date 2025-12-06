package com.example.issuetracker.dto;

import java.time.Instant;

public record AttachmentResponse(Long id, String fileName, String fileType, String filePath, Instant uploadedAt) {}
