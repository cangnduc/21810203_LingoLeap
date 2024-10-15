# Question Schema

## Fields

| Field Name     | Type                 | Required    | Description                                                                                                |
| -------------- | -------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| type           | String (enum)        | Yes         | Type of question (single_choice, multiple_choice, drag_and_drop, matching, flashcard, short_answer, essay) |
| questionText   | String               | Yes         | The main text of the question (max 1000 characters)                                                        |
| instruction    | String               | No          | Additional instructions for the question (max 500 characters)                                              |
| answers        | Array of Objects     | No          | Possible answers for multiple choice questions                                                             |
| correctAnswer  | String               | Conditional | Correct answer for single choice questions                                                                 |
| correctAnswers | Array of Strings     | Conditional | Correct answers for multiple choice questions                                                              |
| matchOptions   | Array of Objects     | No          | Options for matching questions                                                                             |
| correctMatches | Array of Objects     | No          | Correct matches for matching questions                                                                     |
| frontText      | String               | No          | Front text for flashcard questions (max 500 characters)                                                    |
| backText       | String               | No          | Back text for flashcard questions (max 500 characters)                                                     |
| audioFile      | String               | No          | URL or path to an audio file                                                                               |
| imageFile      | String               | No          | URL or path to an image file                                                                               |
| scoringRubric  | String               | No          | Rubric for scoring the question (max 1000 characters)                                                      |
| difficulty     | Number               | Yes         | Difficulty level of the question (1-5)                                                                     |
| createdBy      | ObjectId (ref: User) | Yes         | Reference to the user who created the question                                                             |

## Sub-schemas

### Answer Schema

| Field Name | Type    | Required | Description                                   |
| ---------- | ------- | -------- | --------------------------------------------- |
| text       | String  | No       | The text of the answer (max 500 characters)   |
| correct    | Boolean | No       | Whether this answer is correct                |
| feedback   | String  | No       | Feedback for this answer (max 500 characters) |

### Match Option Schema

| Field Name | Type   | Required | Description                                       |
| ---------- | ------ | -------- | ------------------------------------------------- |
| id         | String | Yes      | Unique identifier for the match option            |
| text       | String | Yes      | The text of the match option (max 500 characters) |

## Indexes

- `{ type: 1, difficulty: 1 }`
- `{ createdBy: 1 }`

## Methods

- `isMultipleChoice()`: Returns true if the question type is "multiple_choice"
- `isSingleChoice()`: Returns true if the question type is "single_choice"

## Virtuals

- `hasAudio`: Returns true if an audio file is associated with the question
- `hasImage`: Returns true if an image file is associated with the question

## Notes

- The `correctAnswer` field is required only for single choice questions.
- The `correctAnswers` array is required only for multiple choice questions.
- The `answers` array contains objects that follow the Answer Schema.
- The `matchOptions` array contains objects that follow the Match Option Schema.
- The `correctMatches` array contains objects with `questionId` and `answerId` fields for matching questions.
- The `difficulty` field must be a number between 1 and 5.
- All text fields have maximum length restrictions to prevent excessively long content.
