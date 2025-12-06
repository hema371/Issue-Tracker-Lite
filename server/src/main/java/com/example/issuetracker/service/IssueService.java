package com.example.issuetracker.service;

import com.example.issuetracker.dto.IssueRequest;
import com.example.issuetracker.entity.Issue;
import com.example.issuetracker.entity.IssuePriority;
import com.example.issuetracker.entity.IssueStatus;
import com.example.issuetracker.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class IssueService {
    private final IssueRepository repo;
    public IssueService(IssueRepository repo){this.repo=repo;}

    public Issue createIssue(IssueRequest req){
        Issue i = new Issue();
        i.setTitle(req.title());
        i.setDescription(req.description());
        i.setStatus(req.status()!=null?req.status():IssueStatus.OPEN);
        i.setPriority(req.priority()!=null?req.priority():IssuePriority.MEDIUM);
        i.setCreatedAt(Instant.now());
        i.setUpdatedAt(Instant.now());
        return repo.save(i);
    }
    public List<Issue> listAll(String q, IssueStatus status, IssuePriority priority){
        if(q!=null && !q.isBlank()) return repo.searchByTitle(q);
        if(status!=null) return repo.findByStatus(status);
        if(priority!=null) return repo.findByPriority(priority);
        return repo.findAll();
    }
    public Optional<Issue> findById(Long id){return repo.findById(id);}
    public Issue update(Long id, IssueRequest req){
        Issue i = repo.findById(id).orElseThrow();
        if(req.title()!=null) i.setTitle(req.title());
        if(req.description()!=null) i.setDescription(req.description());
        if(req.status()!=null) i.setStatus(req.status());
        if(req.priority()!=null) i.setPriority(req.priority());
        i.setUpdatedAt(Instant.now());
        return repo.save(i);
    }
    public void delete(Long id){repo.deleteById(id);}
}
