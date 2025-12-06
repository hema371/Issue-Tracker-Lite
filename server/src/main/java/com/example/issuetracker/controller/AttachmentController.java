package com.example.issuetracker.controller;

import com.example.issuetracker.entity.Attachment;
import com.example.issuetracker.repository.AttachmentRepository;
import com.example.issuetracker.service.AttachmentService;
import com.example.issuetracker.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.PathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AttachmentController {
    private final AttachmentService attachmentService;
    private final AttachmentRepository attachmentRepository;
    private final FileStorageService storage;

    public AttachmentController(AttachmentService attachmentService, AttachmentRepository attachmentRepository, FileStorageService storage){
        this.attachmentService=attachmentService; this.attachmentRepository=attachmentRepository; this.storage=storage;
    }

    @PostMapping("/issues/{id}/attachments")
    public ResponseEntity<List<Attachment>> upload(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) throws Exception {
        List<Attachment> ups = attachmentService.upload(id, files);
        return ResponseEntity.status(201).body(ups);
    }

    @GetMapping("/issues/{id}/attachments")
    public List<Attachment> list(@PathVariable Long id){
        return attachmentRepository.findByIssueId(id);
    }

    @GetMapping("/attachments/{attachmentId}/download")
    public ResponseEntity<Resource> download(@PathVariable Long attachmentId) throws Exception {
        Attachment a = attachmentRepository.findById(attachmentId).orElseThrow();
        Path p = storage.loadPath(a.getFilePath());
        Resource r = new PathResource(p);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+a.getFileName()+"\"")
                .body(r);
    }
}
