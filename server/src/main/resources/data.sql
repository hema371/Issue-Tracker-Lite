-- Sample Data for IssueTracker

INSERT INTO issues (title, description, status, priority) VALUES
('Login error on mobile', 'Users get 500 error when trying to login from mobile devices', 'OPEN', 'HIGH'),
('Dashboard slowness', 'Dashboard takes more than 10 seconds to load when there are 1000+ issues', 'IN_PROGRESS', 'MEDIUM'),
('Export to PDF not working', 'Export issue list to PDF feature crashes when list exceeds 100 items', 'OPEN', 'MEDIUM'),
('Search filters not resetting', 'When applying multiple filters, previous filter values persist incorrectly', 'RESOLVED', 'LOW'),
('Update attachment metadata', 'Allow users to edit attachment file names after upload', 'OPEN', 'LOW'),
('Add bulk issue deletion', 'Implement ability to select multiple issues and delete them in bulk', 'IN_PROGRESS', 'MEDIUM'),
('Performance optimization needed', 'Database queries need optimization for better response times', 'OPEN', 'HIGH'),
('Dark mode support', 'Add dark mode theme to the application UI', 'OPEN', 'LOW');

INSERT INTO attachments (issue_id, file_name, file_type, file_path) VALUES
(1, 'error-screenshot.png', 'image/png', '1/uuid-error-screenshot.png'),
(1, 'network-log.txt', 'text/plain', '1/uuid-network-log.txt'),
(3, 'export-sample.pdf', 'application/pdf', '3/uuid-export-sample.pdf'),
(2, 'performance-trace.json', 'application/json', '2/uuid-performance-trace.json');
