import { Routes } from '@angular/router';
import { IssueListComponent } from './issue-list.component';
import { IssueDetailComponent } from './issue-detail.component';
import { IssueNewComponent } from './issue-new.component';
import { IssueEditComponent } from './issue-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/issues', pathMatch: 'full' },
  { path: 'issues', component: IssueListComponent },
  { path: 'issues/new', component: IssueNewComponent },
  { path: 'issues/:id', component: IssueDetailComponent },
  { path: 'issues/:id/edit', component: IssueEditComponent }
];
