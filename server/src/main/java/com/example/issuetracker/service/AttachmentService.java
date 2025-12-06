package com.example.issuetracker.service;

import com.example.issuetracker.entity.Attachment;
import com.example.issuetracker.entity.Issue;
import com.example.issuetracker.repository.AttachmentRepository;
import com.example.issuetracker.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttachmentService {
    private final AttachmentRepository repo;
    private final IssueRepository issueRepo;
    private final FileStorageService storage;

    public AttachmentService(AttachmentRepository repo, IssueRepository issueRepo, FileStorageService storage){
        this.repo=repo; this.issueRepo=issueRepo; this.storage=storage;
    }

    public List<Attachment> upload(Long issueId, MultipartFile[] files) throws IOException {
        Issue issue = issueRepo.findById(issueId).orElseThrow();
        List<Attachment> saved = new ArrayList<>();
        for(MultipartFile f: files){
            Path p = storage.store(f, issueId);
            Attachment a = new Attachment();
            a.setIssue(issue);
            a.setFileName(f.getOriginalFilename());
            a.setFileType(f.getContentType());
            String relative = issueId + "/" + p.getFileName().toString();
            a.setFilePath(relative);
            saved.add(repo.save(a));
        }
        return saved;
    }
}
