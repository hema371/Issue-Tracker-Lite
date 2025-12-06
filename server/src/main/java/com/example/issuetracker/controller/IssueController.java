package com.example.issuetracker.controller;

import com.example.issuetracker.dto.AttachmentResponse;
import com.example.issuetracker.dto.IssueRequest;
import com.example.issuetracker.dto.IssueResponse;
import com.example.issuetracker.entity.Attachment;
import com.example.issuetracker.entity.Issue;
import com.example.issuetracker.service.IssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {
    private final IssueService service;
    public IssueController(IssueService service){this.service=service;}

    @PostMapping
    public ResponseEntity<IssueResponse> create(@Validated @RequestBody IssueRequest req){
        Issue i = service.createIssue(req);
        return ResponseEntity.status(201).body(map(i));
    }

    @GetMapping
    public List<IssueResponse> list(@RequestParam(required=false) String q,
                                    @RequestParam(required=false) String status,
                                    @RequestParam(required=false) String priority){
        List<Issue> list = service.listAll(q, status!=null?Enum.valueOf(com.example.issuetracker.entity.IssueStatus.class, status):null,
                priority!=null?Enum.valueOf(com.example.issuetracker.entity.IssuePriority.class, priority):null);
        return list.stream().map(this::map).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public IssueResponse get(@PathVariable Long id){
        Issue i = service.findById(id).orElseThrow();
        return map(i);
    }

    @PutMapping("/{id}")
    public IssueResponse update(@PathVariable Long id, @Validated @RequestBody IssueRequest req){
        return map(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private IssueResponse map(Issue i){
        List<AttachmentResponse> at = i.getAttachments().stream().map(a ->
            new AttachmentResponse(a.getId(), a.getFileName(), a.getFileType(), a.getFilePath(), a.getUploadedAt())
        ).collect(Collectors.toList());
        return new IssueResponse(i.getId(), i.getTitle(), i.getDescription(), i.getStatus(), i.getPriority(), i.getCreatedAt(), i.getUpdatedAt(), at);
    }
}
