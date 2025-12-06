# IssueTracker Server - Spring Boot 3.3

## Overview
Spring Boot 3.3 REST API server for IssueTracker Lite. Provides complete CRUD operations for issues and attachments with validation, error handling, and file storage.

## Prerequisites
- JDK 21
- Maven 3.8+
- MySQL 8.0+

## Database Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE issuetracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Update Configuration
Edit `src/main/resources/application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/issuetracker?serverTimezone=UTC&useSSL=false
    username: root
    password: your_password
```

### 3. Run Application
```bash
cd server
mvn spring-boot:run
```

The application will:
- Auto-create tables via Hibernate
- Load sample data from `data.sql`
- Start on `http://localhost:8080`

## API Documentation

### Swagger UI
Visit: `http://localhost:8080/swagger-ui/index.html`

### Base URL
All endpoints use `/api` prefix

### Issue Endpoints

#### List Issues
```
GET /api/issues?q=search&status=OPEN&priority=HIGH
```
Query Parameters (all optional):
- `q` - Search by title
- `status` - Filter by status (OPEN, IN_PROGRESS, RESOLVED)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH)

Response: Array of Issue objects

#### Get Issue Details
```
GET /api/issues/{id}
```
Response: Issue object with all attachments

#### Create Issue
```
POST /api/issues
Content-Type: application/json

{
  "title": "Login error on mobile",
  "description": "Users get 500 error when trying to login",
  "status": "OPEN",
  "priority": "HIGH"
}
```
Response: Created Issue object with id and timestamps

#### Update Issue
```
PUT /api/issues/{id}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```
Response: Updated Issue object

#### Delete Issue
```
DELETE /api/issues/{id}
```
Response: 204 No Content (cascades delete to attachments)

### Attachment Endpoints

#### Upload Attachments
```
POST /api/issues/{issueId}/attachments
Content-Type: multipart/form-data

files: [file1, file2, ...]
```
Response: Array of Attachment objects

#### List Attachments
```
GET /api/issues/{issueId}/attachments
```
Response: Array of Attachment objects

#### Download Attachment
```
GET /api/attachments/{attachmentId}/download
```
Response: File stream with Content-Disposition header

## Error Handling

All errors return consistent JSON format:
```json
{
  "timestamp": "2025-11-11T10:25:31Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "fieldErrors": [
    {
      "field": "title",
      "message": "must not be blank"
    }
  ]
}
```

### Common HTTP Status Codes
- 201 - Created successfully
- 200 - Success
- 204 - Deleted successfully
- 400 - Validation error
- 404 - Not found
- 500 - Server error

## Project Structure
```
src/main/java/com/example/issuetracker/
├── controller/              # REST endpoints
│   ├── IssueController.java
│   └── AttachmentController.java
├── service/                 # Business logic
│   ├── IssueService.java
│   ├── AttachmentService.java
│   └── FileStorageService.java
├── repository/              # Data access
│   ├── IssueRepository.java
│   └── AttachmentRepository.java
├── entity/                  # JPA entities
│   ├── Issue.java
│   ├── Attachment.java
│   ├── IssueStatus.java
│   └── IssuePriority.java
├── dto/                     # Data transfer objects
│   ├── IssueRequest.java
│   ├── IssueResponse.java
│   └── AttachmentResponse.java
├── exception/               # Error handling
│   └── GlobalExceptionHandler.java
└── IssueTrackerApplication.java
```

## Configuration

### application.yaml
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/issuetracker?serverTimezone=UTC&useSSL=false
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update  # Options: create, create-drop, update, validate
    show-sql: false
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

app:
  upload:
    dir: uploads  # Directory for storing uploaded files

springdoc:
  swagger-ui:
    path: /swagger-ui.html
```

## Building

### Maven Build
```bash
mvn clean install
```

### JAR Packaging
```bash
mvn clean package -DskipTests
java -jar target/issuetracker-server-0.0.1-SNAPSHOT.jar
```

## Testing

### Run Tests
```bash
mvn test
```

### Run with Maven
```bash
mvn spring-boot:run
```

## File Upload

### Location
Files are stored in the `uploads/` directory relative to the application working directory.

Structure:
```
uploads/
├── 1/
│   └── uuid-filename.ext
├── 2/
│   ├── uuid-document1.pdf
│   └── uuid-document2.pdf
```

### Limits
- Max file size: 10MB (configurable)
- Supported types: Any
- Multiple files per issue supported

## Troubleshooting

### Database Connection Error
```
Error: HikariPool - Connection is not available, request timed out after 30000ms
```
Solution:
- Ensure MySQL is running: `sudo systemctl start mysql`
- Check connection string and credentials
- Verify database exists

### File Upload 413 Error
```
The field 'file' exceeds its maximum permitted size
```
Solution:
- Increase limits in `application.yaml`:
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
```

### CORS Issues
Add to controller class (already included in default configuration):
```java
@CrossOrigin(origins = "http://localhost:4200")
```

## Production Deployment

### Before Deploying
1. Set `ddl-auto: validate` (never update in production)
2. Configure MySQL with proper backups
3. Set absolute path for file uploads
4. Enable HTTPS
5. Set environment variables for sensitive data
6. Configure connection pooling

### Environment Variables
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/issuetracker
export SPRING_DATASOURCE_USERNAME=dbuser
export SPRING_DATASOURCE_PASSWORD=dbpass
export APP_UPLOAD_DIR=/var/issuetracker/uploads
```

### Run with Environment Variables
```bash
java -jar target/issuetracker-server-0.0.1-SNAPSHOT.jar
```

## Performance Tips
1. Add database indexes (auto-created by schema)
2. Enable pagination for large datasets
3. Cache frequently accessed issues
4. Compress uploaded files
5. Monitor query performance with `show-sql: true` (development only)

## Support
For issues or questions, refer to the main README.md
