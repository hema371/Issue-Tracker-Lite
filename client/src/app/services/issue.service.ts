export const API_BASE = '/api';

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadedAt: string;
}

export interface IssueRequest {
  title: string;
  description: string;
  status: string;
  priority: string;
}

export async function listIssues(q='', status='', priority=''){
  const params = new URLSearchParams();
  if(q) params.append('q', q);
  if(status) params.append('status', status);
  if(priority) params.append('priority', priority);
  const res = await fetch(API_BASE + '/issues?' + params.toString());
  if(!res.ok) throw new Error(`Failed to list issues: ${res.statusText}`);
  return res.json();
}

export async function getIssue(id: number): Promise<Issue> {
  const res = await fetch(API_BASE + '/issues/' + id);
  if(!res.ok) throw new Error(`Failed to get issue: ${res.statusText}`);
  return res.json();
}

export async function createIssue(payload: any): Promise<Issue> {
  const res = await fetch(API_BASE + '/issues', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create issue');
  }
  return res.json();
}

export async function updateIssue(id: number, payload: any): Promise<Issue> {
  const res = await fetch(API_BASE + '/issues/' + id, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update issue');
  }
  return res.json();
}

export async function deleteIssue(id: number): Promise<void> {
  const res = await fetch(API_BASE + '/issues/' + id, {method: 'DELETE'});
  if(!res.ok) throw new Error('Failed to delete issue');
}

export async function uploadAttachments(issueId: number, files: File[]): Promise<Attachment[]> {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  const res = await fetch(API_BASE + '/issues/' + issueId + '/attachments', {
    method: 'POST',
    body: formData
  });
  if(!res.ok) throw new Error('Failed to upload attachments');
  return res.json();
}

export async function downloadAttachment(attachmentId: number, fileName: string): Promise<void> {
  const res = await fetch(API_BASE + '/attachments/' + attachmentId + '/download');
  if(!res.ok) throw new Error('Failed to download attachment');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}
