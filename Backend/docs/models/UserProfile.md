# UserProfile Model

## Schema

- user: ObjectId (ref: "User", required, unique)
- testTaken: Array of ObjectId (ref: "Test")
- testScore: Array of Number (min: 0, max: 100)
- achievements: Array of String
- preferences:
  - notificationSettings: Boolean (default: true)
  - studyReminders: Boolean (default: true)
- learningGoals: Array of String (max length: 200 characters)
- targetExams: Array of String
- studyPlan: ObjectId (ref: "StudyPlan")
- progressTracking:
  - vocabularyMastered: Number (min: 0, default: 0)
  - grammarPointsLearned: Number (min: 0, default: 0)
  - listeningHoursPracticed: Number (min: 0, default: 0)
  - speakingSessionsCompleted: Number (min: 0, default: 0)
  - writingAssignmentsSubmitted: Number (min: 0, default: 0)
- deviceInfo: Array of:
  - deviceType: String (required)
  - lastUsed: Date (default: current date)
- socialConnections:
  - studyBuddies: Array of ObjectId (ref: "User")
  - following: Array of ObjectId (ref: "User")
  - followers: Array of ObjectId (ref: "User")
- feedbackProvided: Array of ObjectId (ref: "Feedback")

## Relationships

- Belongs to one User
- Can have many Tests taken
- Can have one StudyPlan
- Can have many study buddies, following, and followers (User)
- Can have many Feedback provided

## Methods

- `addTestScore(score: number): Promise<UserProfile>`
- `updateProgressTracking(field: string, value: number): Promise<UserProfile>`

## Indexes

- { user: 1 } (unique)
- { 'socialConnections.studyBuddies': 1 }

## Validation

- User reference is required and unique
- Test scores must be between 0 and 100
- Learning goals cannot exceed 200 characters
- All progress tracking fields must be non-negative

## Timestamps

- Created at
- Updated at
