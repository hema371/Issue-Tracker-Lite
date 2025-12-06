# IssueTracker Lite - Client (Angular 18)

## Overview
This is the Angular 18 frontend for the IssueTracker Lite application. It provides a complete UI for managing issues with CRUD operations, file uploads, filtering, and responsive design.

## Features
- Issue list with search, filtering, and sorting
- Create and edit issues
- View issue details with attachments
- Upload and download attachments
- Responsive design for mobile, tablet, and desktop
- Real-time error messages and success notifications

## Prerequisites
- Node.js LTS (v18+)
- npm (v10+)
- Angular CLI 18

## Setup & Installation

### 1. Install Node.js & Angular CLI
```bash
npm install -g @angular/cli@18
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Backend URL
Ensure the backend is running on `http://localhost:8080`. The proxy configuration in `proxy.conf.json` forwards all `/api` calls to the backend.

## Running the Application

### Development Server
```bash
npm start
```
The application will automatically open in your browser at `http://localhost:4200`

### Build for Production
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

## Project Structure
```
src/
├── app/
│   ├── app.component.ts          # Main app container
│   ├── app.routes.ts             # Routing configuration
│   ├── issue-list.component.ts   # List page with filters
│   ├── issue-detail.component.ts # Details page with attachments
│   ├── issue-new.component.ts    # Create issue form
│   ├── issue-edit.component.ts   # Edit issue form
│   └── services/
│       └── issue.service.ts      # API service layer
├── main.ts                        # Bootstrap
└── index.html
```

## Key Components

### IssueListComponent
- Displays all issues in a card grid
- Search by title
- Filter by status (OPEN, IN_PROGRESS, RESOLVED)
- Filter by priority (LOW, MEDIUM, HIGH)
- Sort by creation date
- Click to view details

### IssueDetailComponent
- Show full issue information
- Display attachments with download links
- Upload multiple files
- Edit and delete options

### IssueNewComponent
- Create new issue form with validation
- Required: title, description
- Optional: status (default: OPEN), priority (default: MEDIUM)

### IssueEditComponent
- Edit existing issue
- Update any field
- Validation on client and server side

## API Integration
All API calls are handled through `issue.service.ts`. The service provides:
- `listIssues(q, status, priority)` - Get filtered list
- `getIssue(id)` - Get single issue with attachments
- `createIssue(payload)` - Create new issue
- `updateIssue(id, payload)` - Update existing issue
- `deleteIssue(id)` - Delete issue
- `uploadAttachments(issueId, files)` - Upload files
- `downloadAttachment(id, fileName)` - Download file

## Styling
The application uses:
- **CSS Grid & Flexbox** for responsive layouts
- **Mobile-first** approach
- **Color scheme**: Blue (#007bff), Red (#dc3545), Green (#28a745)
- **Breakpoints**: 768px (tablet), 600px (mobile)

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure:
1. Backend is running on `http://localhost:8080`
2. Proxy configuration is correct in `proxy.conf.json`
3. Use `npm start` which applies the proxy configuration

### 404 on Refresh
The backend must serve `index.html` for all non-API routes to support client-side routing.

### Build Size
Current production bundle is optimized for <500KB. For further optimization:
```bash
npm run build -- --configuration production --stats-json
ng build --stats-json
```

## Best Practices
- Components are standalone (no NgModules)
- Reactive forms for validation
- TypeScript strict mode enabled
- Error handling with try-catch
- Loading states for async operations

## Next Steps
- Add unit tests (Karma/Jasmine)
- Implement authentication
- Add pagination
- Implement dark mode
- Add accessibility features (ARIA labels, keyboard navigation)

## Support
For issues or questions, refer to the main README.md in the project root.
