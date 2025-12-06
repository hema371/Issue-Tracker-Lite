package com.example.issuetracker.repository;

import com.example.issuetracker.entity.Issue;
import com.example.issuetracker.entity.IssuePriority;
import com.example.issuetracker.entity.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByStatus(IssueStatus status);
    List<Issue> findByPriority(IssuePriority priority);
    @Query("select i from Issue i where lower(i.title) like lower(concat('%', ?1, '%'))")
    List<Issue> searchByTitle(String q);
}
