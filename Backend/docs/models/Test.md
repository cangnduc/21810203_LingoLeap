# Test Model

## Schema

- title: String (required, max length: 100 characters)
- description: String (max length: 500 characters)
- duration: Number (required, min: 1 minute)
- sections: Array of:
  - type: String (enum: ["reading", "listening", "writing", "speaking"], required)
  - questions: Array of ObjectId (ref: "Question", required)
  - duration: Number (required, min: 1 minute)
- createdBy: ObjectId (ref: "User", required)
- isPublished: Boolean (default: false)

## Relationships

- Created by one User
- Contains many Questions
- Can have many TestAttempts

## Methods

- `publish(): Promise<Test>`
- `unpublish(): Promise<Test>`

## Virtuals

- `questionCount: number`

## Indexes

- { title: 1 }
- { createdBy: 1 }
- { isPublished: 1 }

## Validation

- Test title is required and cannot exceed 100 characters
- Test description cannot exceed 500 characters
- Test duration must be at least 1 minute
- Each section must have a valid type, at least one question, and a duration of at least 1 minute
- Test creator is required

## Timestamps

- Created at
- Updated at

## Notes

- The `sections` array allows for structuring the test into different parts (reading, listening, writing, speaking)
- The `isPublished` field can be used to control whether the test is available for users to take
- The `questionCount` virtual provides an easy way to get the total number of questions across all sections
