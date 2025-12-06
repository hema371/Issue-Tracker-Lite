-- IssueTracker Database Schema
-- H2 In-Memory Database

CREATE TABLE IF NOT EXISTS issues (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  description CLOB NOT NULL,
  status VARCHAR(20) DEFAULT 'OPEN',
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_priority ON issues(priority);
CREATE INDEX IF NOT EXISTS idx_created_at ON issues(created_at);

CREATE TABLE IF NOT EXISTS attachments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  issue_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_path VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_issue FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_issue_id ON attachments(issue_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_at ON attachments(uploaded_at);
