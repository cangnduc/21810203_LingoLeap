# Question Model

## Schema

- type: String (enum: ["single_choice", "multiple_choice", "drag_and_drop", "matching", "flashcard", "short_answer", "essay"], required)
- questionText: String (required, max length: 1000 characters)
- instruction: String (max length: 500 characters)
- answers: Array of Answer objects
- correctAnswer: String (required for single_choice type)
- correctAnswers: Array of Strings (required for multiple_choice type)
- matchOptions: Array of MatchOption objects
- correctMatches: Array of { questionId: String, answerId: String }
- frontText: String (max length: 500 characters, for flashcard type)
- backText: String (max length: 500 characters, for flashcard type)
- audioFile: String
- imageFile: String
- scoringRubric: String (max length: 1000 characters)
- difficulty: Number (1-5, required)
- createdBy: ObjectId (ref: "User", required)

### Answer Schema

- text: String (max length: 500 characters)
- correct: Boolean
- feedback: String (max length: 500 characters)

### MatchOption Schema

- id: String (required)
- text: String (required, max length: 500 characters)

## Relationships

- Created by one User
- Can be part of many Tests

## Methods

- `isMultipleChoice(): boolean`
- `isSingleChoice(): boolean`

## Virtuals

- `hasAudio: boolean`
- `hasImage: boolean`

## Indexes

- { type: 1, difficulty: 1 }
- { createdBy: 1 }

## Validation

- Question type must be one of the specified enum values
- Question text is required and cannot exceed 1000 characters
- Instruction cannot exceed 500 characters
- Each answer text cannot exceed 500 characters
- Front and back text for flashcards cannot exceed 500 characters
- Scoring rubric cannot exceed 1000 characters
- Difficulty must be a number between 1 and 5
- Question creator is required

## Timestamps

- Created at
- Updated at

## Notes

- The `correctAnswer` field is required only for single choice questions
- The `correctAnswers` array is required only for multiple choice questions
- The `answers` array contains objects that follow the Answer Schema
- The `matchOptions` array contains objects that follow the MatchOption Schema
- The `correctMatches` array is used for matching and drag-and-drop question types
