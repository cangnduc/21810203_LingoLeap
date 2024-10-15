# Detailed Use Case Diagram

## Actors

1. Guest
2. Student
3. Teacher
4. Admin
5. System

## Use Cases

### 1. User Management

- Register Account
- Login
- Logout
- Update Profile
- Manage Subscription

### 2. Course Management

- Create Course
- Edit Course
- Publish Course
- Unpublish Course
- Add Lessons to Course
- Remove Lessons from Course
- Add Tests to Course
- Remove Tests from Course

### 3. Test Management

- Create Test
- Edit Test
- Publish Test
- Unpublish Test
- Add Questions to Test
- Remove Questions from Test

### 4. Question Management

- Create Question
- Edit Question
- Delete Question

### 5. Learning

- Browse Courses
- Enroll in Course
- View Course Content
- Complete Lessons
- Take Test
- View Test Results
- Track Progress

### 6. Teaching

- Grade Tests
- Provide Feedback
- View Student Progress

### 7. Administration

- Manage Users
- Manage Courses
- Manage Tests
- View System Analytics

## Relationships and Associations

### Guest

- Can perform:
  - Browse Courses
  - Register Account (extends to User Management)

### Student

- Inherits all Guest actions
- Can perform all User Management actions
- Can perform all Learning actions

### Teacher

- Inherits all Student actions
- Can perform:
  - All Course Management actions
  - All Test Management actions
  - All Question Management actions
  - All Teaching actions

### Admin

- Inherits all Teacher actions
- Can perform all Administration actions

### System

- Performs:
  - Auto-grade multiple-choice questions (included in Grade Tests)
  - Send notifications (included in various actions like Enroll in Course, Publish Course, etc.)
  - Generate reports (included in View System Analytics)

## Include Relationships

- Login (includes Authenticate User)
- Register Account (includes Verify Email)
- Take Test (includes Record Test Attempt)
- Grade Tests (includes Calculate Score)
- Manage Subscription (includes Process Payment)

## Extend Relationships

- Browse Courses extends to Enroll in Course (for registered users)
- View Test Results extends to Review Mistakes (for completed tests)
- Create Course extends to Add Lessons to Course and Add Tests to Course
- Create Test extends to Add Questions to Test

## Constraints

- Only Teachers and Admins can access Course Management, Test Management, and Question Management
- Only Admins can access Administration functions
- Students can only View Test Results for tests they have taken
- Teachers can only Grade Tests and View Student Progress for their own courses

This detailed use case diagram provides a comprehensive view of the system's functionality, clearly defining the roles of each actor and the relationships between different actions. The include and extend relationships show how certain actions are composed of or build upon others, giving a more nuanced understanding of the system's behavior.
