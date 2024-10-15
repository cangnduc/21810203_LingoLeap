# TestAttempt Model

## Schema

- user: ObjectId (ref: "User", required)
- test: ObjectId (ref: "Test", required)
- startTime: Date (required, default: current date)
- endTime: Date
- maxEndTime: Date (required)
- score: Number (min: 0, max: 100)
- answers: Array of Answer objects
- status: String (enum: ["in-progress", "completed", "abandoned"], default: "in-progress", required)
- result: ObjectId (ref: "TestResult")

### Answer Schema

- question: ObjectId (ref: "Question", required)
- questionType: String (enum: ["single_choice", "multiple_choice", "drag_and_drop", "matching", "flashcard", "short_answer", "essay"], required)
- userAnswer: Mixed (can be any type depending on the question type)
- selectedChoices: Array of Strings (for multiple-choice questions)
- matchedPairs: Array of { questionId: String, answerId: String } (for matching questions)
- audioResponse: String (URL or path to audio file for speaking questions)
- score: Number (min: 0)

## Relationships

- Belongs to one User
- Belongs to one Test
- Has many Question references
- Has one TestResult

## Methods

- `calculateScore(): Number`
- `start(test: Test): Promise<TestAttempt>`
- `complete(): Promise<TestAttempt>`
- `isTimeUp(): boolean`

## Indexes

- { user: 1, test: 1 }
- { status: 1 }

## Hooks

- Pre-save: Calculate score if answers are modified

## Validation

- User and Test references are required
- Start time is required
- Score must be between 0 and 100
- Answer scores cannot be negative
- Status must be one of ["in-progress", "completed", "abandoned"]
- QuestionType must be one of the specified enum values

## Timestamps

- Created at
- Updated at

## Notes

- The `userAnswer` field can contain different types of data depending on the question type:
  - For text-based questions (reading, writing): String
  - For single-choice questions: String (representing the chosen option)
  - For multiple-choice questions: Use the `selectedChoices` array
  - For matching questions: Use the `matchedPairs` array
  - For speaking questions: Use the `audioResponse` field
- The `score` field in the Answer schema is used for individual question scores, while the main `score` field represents the overall test score
- The `maxEndTime` field is set when the test attempt is started and is used to enforce the time limit of the test.
- The `endTime` field represents the actual time when the test was completed or abandoned, which may be earlier than `maxEndTime`.
- The `isTimeUp()` method can be used to check if the test duration has expired.
