# Teacher Use Cases

## Actor Description

An advanced user who can create and manage tests, grade submissions, and monitor student progress.

## Characteristics

- Advanced system privileges
- Can create and manage content
- Can assess student work
- Can provide feedback
- Inherits Student capabilities

## Primary Use Cases

### UC-T1: Create and Manage Tests

**Preconditions:**

- Teacher is authenticated
- Has content creation privileges

**Basic Flow:**

1. Teacher accesses test management interface
2. Creates new test:
   - Sets test parameters
   - Adds sections
   - Configures questions
   - Sets scoring rules
   - Defines time limits
3. System validates test structure
4. Teacher reviews test
5. Teacher publishes/saves draft

**Alternative Flows:**

- A1: Create from Template
  1. Select existing template
  2. Modify as needed
  3. Save as new test
- A2: Import Questions
  1. Access question bank
  2. Select questions
  3. Configure test structure

**Postconditions:**

- Test created/updated
- Question bank updated
- Test available for assignment

**Exceptions:**

- E1: Invalid test structure
- E2: Duplicate test content
- E3: Media upload failure

### UC-T2: Grade and Provide Feedback

**Preconditions:**

- Teacher is authenticated
- Has grading privileges
- Test submissions exist

**Basic Flow:**

1. Access grading interface
2. Select submission to grade
3. For each subjective question:
   - Review response
   - Apply rubric
   - Assign score
   - Provide feedback
4. Review auto-graded sections
5. Submit final grades
6. System notifies student

**Alternative Flows:**

- A1: Batch Grading
- A2: Request Second Review
- A3: Use AI Assistance

**Postconditions:**

- Grades recorded
- Feedback stored
- Students notified
- Statistics updated

**Exceptions:**

- E1: Grading deadline missed
- E2: System calculation error
- E3: Invalid score entry

### UC-T3: Monitor Student Performance

**Preconditions:**

- Teacher is authenticated
- Has student data access

**Basic Flow:**

1. Access analytics dashboard
2. View:
   - Class performance
   - Individual progress
   - Test statistics
   - Improvement trends
3. Generate reports
4. Identify areas for improvement
5. Create action plans

**Alternative Flows:**

- A1: Export Analytics
- A2: Schedule Reports
- A3: Share Insights

**Postconditions:**

- Reports generated
- Insights recorded
- Recommendations created

## Relationships

### Includes

- Question Management (included in Create Test)
- Apply Rubric (included in Grading)
- Generate Analytics (included in Monitoring)

### Extends

- Advanced Test Settings (extends Create Test)
- Batch Processing (extends Grade Submissions)
- Custom Reports (extends View Analytics)

## Constraints

- Must maintain test integrity
- Grading deadlines
- Content quality standards
- Student data privacy
- Resource usage limits
