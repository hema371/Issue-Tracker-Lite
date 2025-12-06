import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { createIssue } from './services/issue.service';

@Component({
  selector: 'app-issue-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="new-container">
      <div class="header">
        <button class="btn-back" (click)="goBack()">← Back</button>
        <h1>Create New Issue</h1>
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Title</label>
          <input type="text" formControlName="title" class="form-control" placeholder="Brief issue title">
          <div class="error-text" *ngIf="form.get('title')?.invalid && form.get('title')?.touched">
            Title is required (max 150 characters)
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea formControlName="description" class="form-control" rows="6" placeholder="Detailed description..."></textarea>
          <div class="error-text" *ngIf="form.get('description')?.invalid && form.get('description')?.touched">
            Description is required (min 10 characters)
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
            {{ submitting ? 'Creating...' : 'Create Issue' }}
          </button>
          <button type="button" class="btn-secondary" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .new-container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .header h1 { margin: 0; flex: 1; }
    .btn-back { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #007bff; }
    .error { background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
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
export class IssueNewComponent {
  form: FormGroup;
  submitting = false;
  error = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['OPEN'],
      priority: ['MEDIUM']
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = '';
    try {
      const issue = await createIssue(this.form.value);
      this.router.navigate(['/issues', issue.id]);
    } catch (err: any) {
      this.error = err.message;
      this.submitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/issues']);
  }
}
