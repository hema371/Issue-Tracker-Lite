import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { listIssues, Issue } from './services/issue.service';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="issue-list-container">
      <div class="header">
        <h1>Issues</h1>
        <button class="btn-primary" (click)="createNew()">+ New Issue</button>
      </div>

      <div class="filters">
        <input type="text" placeholder="Search by title..." [(ngModel)]="searchQuery" (change)="applyFilters()">
        <select [(ngModel)]="statusFilter" (change)="applyFilters()">
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select [(ngModel)]="priorityFilter" (change)="applyFilters()">
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div *ngIf="loading" class="loading">Loading issues...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && issues.length === 0" class="empty-state">
        <p>No issues found. Create one to get started!</p>
      </div>

      <div *ngIf="issues.length > 0" class="issues-grid">
        <div *ngFor="let issue of issues" class="issue-card" (click)="viewIssue(issue.id)">
          <div class="issue-header">
            <h3>{{ issue.title }}</h3>
            <span class="status-badge" [ngClass]="issue.status.toLowerCase()">{{ issue.status }}</span>
          </div>
          <p class="issue-description">{{ issue.description | slice:0:100 }}...</p>
          <div class="issue-meta">
            <span class="priority-badge" [ngClass]="issue.priority.toLowerCase()">{{ issue.priority }}</span>
            <span class="date">{{ formatDate(issue.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .issue-list-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h1 { margin: 0; }
    .btn-primary { padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    .btn-primary:hover { background: #0056b3; }
    .filters { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .filters input, .filters select { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.95rem; }
    .loading, .error { padding: 1rem; text-align: center; }
    .error { color: #dc3545; background: #f8d7da; border-radius: 4px; }
    .empty-state { text-align: center; padding: 3rem; color: #666; }
    .issues-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .issue-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.3s; }
    .issue-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(-2px); }
    .issue-header { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1rem; }
    .issue-header h3 { margin: 0; flex: 1; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
    .status-badge.open { background: #fff3cd; color: #856404; }
    .status-badge.in_progress { background: #d1ecf1; color: #0c5460; }
    .status-badge.resolved { background: #d4edda; color: #155724; }
    .issue-description { margin: 0.5rem 0; color: #666; line-height: 1.5; }
    .issue-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; font-size: 0.85rem; }
    .priority-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
    .priority-badge.low { background: #e7f3ff; color: #004085; }
    .priority-badge.medium { background: #fff3cd; color: #856404; }
    .priority-badge.high { background: #f8d7da; color: #721c24; }
    .date { color: #999; }
    @media (max-width: 768px) {
      .issue-list-container { padding: 1rem; }
      .header { flex-direction: column; align-items: start; }
      .filters { flex-direction: column; }
      .filters input, .filters select { width: 100%; }
      .issues-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];
  loading = false;
  error = '';
  searchQuery = '';
  statusFilter = '';
  priorityFilter = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadIssues();
  }

  async loadIssues() {
    this.loading = true;
    this.error = '';
    try {
      this.issues = await listIssues(this.searchQuery, this.statusFilter, this.priorityFilter);
    } catch (err: any) {
      this.error = err.message || 'Failed to load issues';
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    this.loadIssues();
  }

  viewIssue(id: number) {
    this.router.navigate(['/issues', id]);
  }

  createNew() {
    this.router.navigate(['/issues/new']);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }
}
