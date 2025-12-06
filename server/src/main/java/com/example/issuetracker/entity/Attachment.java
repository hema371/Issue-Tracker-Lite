package com.example.issuetracker.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "attachments")
public class Attachment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id")
    private Issue issue;

    private String fileName;
    private String fileType;
    private String filePath;
    private Instant uploadedAt = Instant.now();

    // getters/setters
    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public Issue getIssue(){return issue;}
    public void setIssue(Issue issue){this.issue=issue;}
    public String getFileName(){return fileName;}
    public void setFileName(String fileName){this.fileName=fileName;}
    public String getFileType(){return fileType;}
    public void setFileType(String fileType){this.fileType=fileType;}
    public String getFilePath(){return filePath;}
    public void setFilePath(String filePath){this.filePath=filePath;}
    public Instant getUploadedAt(){return uploadedAt;}
    public void setUploadedAt(Instant uploadedAt){this.uploadedAt=uploadedAt;}
}
