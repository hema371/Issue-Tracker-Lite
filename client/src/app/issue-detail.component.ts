import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getIssue, deleteIssue, uploadAttachments, downloadAttachment, Issue, Attachment } from './services/issue.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container">
      <div class="header">
        <button class="btn-back" (click)="goBack()">← Back</button>
        <h1>Issue Details</h1>
        <div class="actions">
          <button class="btn-secondary" (click)="editIssue()">Edit</button>
          <button class="btn-danger" (click)="deleteIssueConfirm()">Delete</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Loading issue...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="successMessage" class="success">{{ successMessage }}</div>

      <div *ngIf="issue && !loading" class="issue-detail">
        <div class="issue-main">
          <h2>{{ issue.title }}</h2>
          <div class="badges">
            <span class="status-badge" [ngClass]="issue.status.toLowerCase()">{{ issue.status }}</span>
            <span class="priority-badge" [ngClass]="issue.priority.toLowerCase()">{{ issue.priority }}</span>
          </div>

          <div class="metadata">
            <div class="meta-item">
              <strong>Created:</strong> {{ formatDate(issue.createdAt) }}
            </div>
            <div class="meta-item">
              <strong>Updated:</strong> {{ formatDate(issue.updatedAt) }}
            </div>
          </div>

          <div class="description">
            <h3>Description</h3>
            <p>{{ issue.description }}</p>
          </div>
        </div>

        <div class="issue-attachments">
          <h3>Attachments</h3>
          
          <div class="upload-section">
            <label for="fileInput" class="btn-upload">+ Upload Files</label>
            <input #fileInput type="file" id="fileInput" multiple hidden (change)="onFilesSelected($event)">
          </div>

          <div *ngIf="uploadProgress" class="progress">Uploading... {{ uploadProgress }}%</div>

          <div *ngIf="issue.attachments.length === 0" class="no-attachments">
            No attachments yet
          </div>

          <div *ngIf="issue.attachments.length > 0" class="attachments-list">
            <div *ngFor="let att of issue.attachments" class="attachment-item">
              <span class="filename">📎 {{ att.fileName }}</span>
              <div class="attachment-actions">
                <span class="date">{{ formatDate(att.uploadedAt) }}</span>
                <button class="btn-download" (click)="downloadFile(att)">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .header h1 { margin: 0; flex: 1; }
    .btn-back { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #007bff; }
    .actions { display: flex; gap: 0.5rem; }
    .loading, .error, .success { padding: 1rem; border-radius: 4px; text-align: center; }
    .error { background: #f8d7da; color: #721c24; }
    .success { background: #d4edda; color: #155724; }
    .issue-detail { display: grid; grid-template-columns: 1fr 350px; gap: 2rem; }
    .issue-main { background: white; padding: 2rem; border-radius: 8px; }
    .issue-main h2 { margin-top: 0; }
    .badges { display: flex; gap: 0.5rem; margin: 1rem 0; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
    .status-badge.open { background: #fff3cd; color: #856404; }
    .status-badge.in_progress { background: #d1ecf1; color: #0c5460; }
    .status-badge.resolved { background: #d4edda; color: #155724; }
    .priority-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
    .priority-badge.low { background: #e7f3ff; color: #004085; }
    .priority-badge.medium { background: #fff3cd; color: #856404; }
    .priority-badge.high { background: #f8d7da; color: #721c24; }
    .metadata { display: flex; gap: 2rem; margin: 1.5rem 0; font-size: 0.9rem; color: #666; }
    .description { margin-top: 2rem; }
    .description h3 { margin-top: 0; }
    .description p { line-height: 1.6; white-space: pre-wrap; }
    .issue-attachments { background: white; padding: 1.5rem; border-radius: 8px; }
    .issue-attachments h3 { margin-top: 0; }
    .upload-section { margin-bottom: 1.5rem; }
    .btn-upload { display: inline-block; padding: 0.5rem 1rem; background: #28a745; color: white; border-radius: 4px; cursor: pointer; }
    .btn-upload:hover { background: #218838; }
    .progress { padding: 0.5rem; background: #e7f3ff; border-radius: 4px; margin: 0.5rem 0; }
    .no-attachments { color: #999; text-align: center; padding: 1rem; }
    .attachments-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .attachment-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f8f9fa; border-radius: 4px; }
    .filename { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .attachment-actions { display: flex; gap: 1rem; align-items: center; }
    .date { font-size: 0.8rem; color: #999; }
    .btn-download { padding: 0.25rem 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
    .btn-download:hover { background: #0056b3; }
    .btn-secondary, .btn-danger { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-secondary:hover { background: #5a6268; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-danger:hover { background: #c82333; }
    @media (max-width: 768px) {
      .issue-detail { grid-template-columns: 1fr; }
      .header { flex-direction: column; align-items: start; }
      .actions { width: 100%; }
      .actions button { flex: 1; }
      .metadata { flex-direction: column; gap: 0; }
    }
  `]
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  loading = false;
  error = '';
  successMessage = '';
  uploadProgress = 0;
  issueId = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.issueId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadIssue();
  }

  async loadIssue() {
    this.loading = true;
    this.error = '';
    try {
      this.issue = await getIssue(this.issueId);
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  async onFilesSelected(event: any) {
    const files = Array.from(event.target.files as FileList);
    if (files.length === 0) return;

    this.uploadProgress = 50;
    try {
      const attachments = await uploadAttachments(this.issueId, files as File[]);
      if (this.issue) {
        this.issue.attachments.push(...attachments);
      }
      this.successMessage = `${files.length} file(s) uploaded successfully!`;
      event.target.value = '';
      this.uploadProgress = 0;
      setTimeout(() => this.successMessage = '', 3000);
    } catch (err: any) {
      this.error = err.message;
      this.uploadProgress = 0;
    }
  }

  downloadFile(attachment: Attachment) {
    downloadAttachment(attachment.id, attachment.fileName);
  }

  editIssue() {
    this.router.navigate(['/issues', this.issueId, 'edit']);
  }

  deleteIssueConfirm() {
    if (confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      this.deleteIssue();
    }
  }

  async deleteIssue() {
    try {
      await deleteIssue(this.issueId);
      this.router.navigate(['/issues']);
    } catch (err: any) {
      this.error = err.message;
    }
  }

  goBack() {
    this.router.navigate(['/issues']);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
}
