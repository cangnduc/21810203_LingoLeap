# Detailed Use Case Diagram

## System Overview

The English Testing Application is a comprehensive platform designed to facilitate English language assessment through various test types, including reading, writing, listening, and speaking sections. The system supports multiple user roles with different privileges and responsibilities.

## Actors

### 1. Guest

- **Characteristics:**
  - Unauthenticated user
  - Limited access to system features
  - Can preview public content
- **Responsibilities:**
  - Browse available tests
  - View public test information
  - Register for an account
  - Access free sample tests

### 2. Student (inherits from Guest)

- **Characteristics:**
  - Authenticated user
  - Has a valid profile
  - May have an active subscription
- **Responsibilities:**
  - Take tests
  - View personal results
  - Track progress
  - Manage profile
  - Access learning resources
  - Manage subscription

### 3. Teacher (inherits from Student)

- **Characteristics:**
  - Advanced user privileges
  - Content creation capabilities
  - Access to grading system
- **Responsibilities:**
  - Create and manage tests
  - Grade subjective questions
  - Review student performance
  - Manage question bank
  - Provide feedback
  - Create and manage courses

### 4. Admin (inherits from Teacher)

- **Characteristics:**
  - Highest level of system access
  - System management capabilities
  - Content oversight responsibilities
- **Responsibilities:**
  - Manage user accounts
  - Monitor system performance
  - Configure system settings
  - Generate reports
  - Manage content quality

### 5. System

- **Responsibilities:**
  - Handle authentication
  - Process test submissions
  - Auto-grade objective questions
  - Generate reports
  - Manage sessions
  - Send notifications
  - Process payments

## Use Cases

### 1. User Management

- Register Account
- Login
- Logout
- Update Profile
- Manage Subscription
- Reset Password
- Verify Email
- Update Settings
- Manage Notifications

### 2. Test Management

- Create Test
  - Set test parameters
  - Add sections
  - Configure scoring
  - Set time limits
- Edit Test
- Publish Test
- Unpublish Test
- Delete Test
- Clone Test
- Import/Export Test
- Preview Test
- Archive Test

### 3. Question Management

- Create Question
- Edit Question
- Delete Question
- Import Questions
- Export Questions
- Categorize Questions
- Set Question Difficulty
- Add Media to Questions
- Archive Questions
- Manage Question Bank

### 4. Test Taking

- Start Test
- Submit Answers
- Track Progress
- Save Test Progress
- Resume Test
- Submit Test
- View Results
- Review Answers
- Request Review
- Download Certificate

### 5. Grading and Assessment

- Auto-grade Objective Questions
- Manual Grade Subjective Questions
- Provide Feedback
- Review Grades
- Process Appeals
- Calculate Scores
- Generate Reports
- Track Performance

### 6. Learning Management

- View Course Materials
- Track Progress
- Set Learning Goals
- Access Resources
- View Performance Analytics
- Generate Study Plans
- Track Achievements
- Join Study Groups

### 7. Administration

- Manage Users
- Configure System
- Monitor Performance
- Generate Reports
- Manage Content
- Handle Support
- Audit Activities
- Manage Permissions

## Relationships and Associations

### Guest

- Can perform:
  - View public tests
  - Register Account
  - Access sample tests
  - View public resources

### Student

- Inherits all Guest actions
- Can perform:
  - All User Management actions
  - All Test Taking actions
  - All Learning Management actions
  - Basic progress tracking

### Teacher

- Inherits all Student actions
- Can perform:
  - All Test Management actions
  - All Question Management actions
  - All Grading actions
  - Course management
  - Student performance review

### Admin

- Inherits all Teacher actions
- Can perform:
  - All Administration actions
  - System configuration
  - User management
  - Content oversight

## Include Relationships

### Test Management

- Create Test includes:
  - Validate Structure
  - Process Media
  - Set Parameters
  - Configure Sections

### Test Taking

- Take Test includes:
  - Initialize Session
  - Record Responses
  - Track Time
  - Calculate Score
  - Save Progress

### Grading

- Grade Test includes:
  - Apply Rubric
  - Calculate Section Scores
  - Generate Feedback
  - Update Results

## Extend Relationships

### Test Management

- Create Test extends to:
  - Template Creation
  - Question Bank Integration
  - Test Preview

### Results Management

- View Results extends to:
  - Generate Analytics
  - Performance Reports
  - Progress Tracking

### Test Taking

- Take Test extends to:
  - Practice Mode
  - Timed Mode
  - Accessibility Mode

## Business Rules and Constraints

### Test Creation

- Minimum questions per section: 1
- Maximum test duration: 180 minutes
- Required sections: At least one
- Question types must match section type
- Media file size limits:
  - Audio: 10MB
  - Images: 5MB

### Test Taking

- Maximum attempts: Configurable (1-5)
- Time extensions: Based on accessibility needs
- Auto-submit: On time expiration
- Answer changes: Allowed within section time
- Progress save: Every 30 seconds

### Grading

- Auto-grading: Immediate for objective questions
- Manual grading window: 72 hours
- Minimum passing score: Configurable (default 60%)
- Review period: 14 days
- Appeal window: 7 days after results

## Technical Requirements

### Performance

- Maximum users: 10,000 concurrent
- Response time: < 2 seconds
- Availability: 99.9%
- Data backup: Daily

### Security

- Authentication: JWT with refresh tokens
- Session timeout: 30 minutes
- Password policy: Strong
- Data encryption: At rest and in transit
