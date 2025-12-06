import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getIssue, updateIssue, Issue } from './services/issue.service';

@Component({
  selector: 'app-issue-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="edit-container">
      <div class="header">
        <button class="btn-back" (click)="goBack()">← Back</button>
        <h1>Edit Issue</h1>
      </div>

      <div *ngIf="loading" class="loading">Loading issue...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!loading">
        <div class="form-group">
          <label>Title</label>
          <input type="text" formControlName="title" class="form-control">
          <div class="error-text" *ngIf="form.get('title')?.invalid && form.get('title')?.touched">
            Title is required (max 150 characters)
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea formControlName="description" class="form-control" rows="5"></textarea>
          <div class="error-text" *ngIf="form.get('description')?.invalid && form.get('description')?.touched">
            Description is required
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Status</label>
            <select formControlName="status" class="form-control">
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div class="form-group">
            <label>Priority</label>
            <select formControlName="priority" class="form-control">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" [disabled]="form.invalid || submitting">
            {{ submitting ? 'Updating...' : 'Update Issue' }}
          </button>
          <button type="button" class="btn-secondary" (click)="goBack()">Cancel</button>
        </div>
      </form>

      <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
    </div>
  `,
  styles: [`
    .edit-container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .header h1 { margin: 0; flex: 1; }
    .btn-back { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #007bff; }
    .loading, .error, .success { padding: 1rem; border-radius: 4px; text-align: center; }
    .error { background: #f8d7da; color: #721c24; }
    .success { background: #d4edda; color: #155724; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit; }
    .form-control:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.25); }
    .error-text { color: #dc3545; font-size: 0.85rem; margin-top: 0.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-actions { display: flex; gap: 1rem; margin-top: 2rem; }
    .btn-primary, .btn-secondary { padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    .btn-primary { background: #007bff; color: white; }
    .btn-primary:hover { background: #0056b3; }
    .btn-primary:disabled { background: #ccc; cursor: not-allowed; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-secondary:hover { background: #5a6268; }
    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
      .form-actions { flex-direction: column; }
    }
  `]
})
export class IssueEditComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitting = false;
  error = '';
  successMessage = '';
  issueId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', Validators.required],
      status: ['OPEN'],
      priority: ['MEDIUM']
    });
  }

  ngOnInit() {
    this.issueId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadIssue();
  }

  async loadIssue() {
    this.loading = true;
    this.error = '';
    try {
      const issue = await getIssue(this.issueId);
      this.form.patchValue(issue);
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = '';
    this.successMessage = '';
    try {
      await updateIssue(this.issueId, this.form.value);
      this.successMessage = 'Issue updated successfully!';
      setTimeout(() => this.router.navigate(['/issues', this.issueId]), 1500);
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.submitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/issues', this.issueId]);
  }
}
