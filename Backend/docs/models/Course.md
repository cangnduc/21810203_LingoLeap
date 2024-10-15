# Course Model

## Schema

- title: String (required, max length: 100 characters)
- description: String (required, max length: 500 characters)
- instructor: ObjectId (ref: "User", required)
- students: Array of ObjectId (ref: "User")
- lessons: Array of:
  - title: String (required, max length: 100 characters)
  - content: String (required)
  - resources: Array of String
- tests: Array of ObjectId (ref: "Test")
- level: String (enum: ["beginner", "intermediate", "advanced"], required)
- duration: Number (required, min: 1 hour)
- isPublished: Boolean (default: false)

## Relationships

- Has one instructor (User)
- Can have many students (User)
- Can have many Tests

## Methods

- `enroll(studentId: ObjectId): Promise<Course>`
- `unenroll(studentId: ObjectId): Promise<Course>`

## Virtuals

- `studentCount: number`
- `lessonCount: number`

## Indexes

- { title: 1 }
- { instructor: 1 }
- { level: 1 }
- { isPublished: 1 }

## Validation

- Title is required and cannot exceed 100 characters
- Description is required and cannot exceed 500 characters
- Instructor reference is required
- Lesson title is required and cannot exceed 100 characters
- Lesson content is required
- Course level must be one of ["beginner", "intermediate", "advanced"]
- Course duration must be at least 1 hour

## Timestamps

- Created at
- Updated at
