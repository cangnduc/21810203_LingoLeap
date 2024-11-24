# TestResult Model

## Schema

- testAttempt: ObjectId (ref: "TestAttempt", required, unique)
- user: ObjectId (ref: "User", required)
- test: ObjectId (ref: "Test", required)
- totalScore: Number (required, min: 0, max: 100)
- totalQuestions: Number (required, min: 1)
- sectionScores: Array of:
  - sectionType: String (enum: ["reading", "listening", "writing", "speaking"], required)
  - score: Number (required, min: 0)
  - totalQuestions: Number (required, min: 1)
- questionScores: Array of:
  - question: ObjectId (ref: "Question", required)
  - score: Number (required, min: 0)
- feedback: String
- gradedBy: ObjectId (ref: "User")
- gradedAt: Date

## Relationships

- Belongs to one TestAttempt
- Belongs to one User (test taker)
- Belongs to one Test
- Can be graded by one User (teacher)
- Has many Question references

## Methods

- `addFeedback(feedback: string, graderId: ObjectId): Promise<TestResult>`
- `calculateTotalScore(): Number`

## Virtuals

- `isPassing: boolean` (true if totalScore >= 60)

## Indexes

- { user: 1, test: 1 }
- { gradedBy: 1 }
- { testAttempt: 1 }

## Validation

- TestAttempt reference is required and unique
- User reference is required
- Test reference is required
- Total questions must be at least 1
- Section scores must have a valid type, non-negative score, and at least 1 question
- Question scores must reference a valid Question and have a non-negative score

## Timestamps

- Created at
- Updated at

## Notes

- The `sectionScores` array now includes all question types to accommodate the expanded question model
- The `questionScores` array allows for individual scoring of each question in the test
- The `totalQuestions` field provides an easy reference for the total number of questions in the test
- The `calculateTotalScore` method should be implemented to recalculate the total score based on section and question scores
