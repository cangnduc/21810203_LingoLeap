# Class Diagrams Overview

## User

- **Attributes:**

  - email: String (required, unique)
  - username: String (required, unique)
  - password: String (required, min: 8)
  - dateOfBirth: Date
  - phoneNumber: String
  - firstName: String
  - lastName: String
  - address: {street, city, country}
  - avatar: String
  - isVerified: Boolean
  - isDeleted: Boolean
  - role: String (enum: ["user", "teacher", "admin"])
  - userProfile: ObjectId (UserProfile)
  - userStatistics: ObjectId (UserStatistics)

- **Methods:**
  - comparePassword(candidatePassword: string): Promise<boolean>
  - getProfileByUserId(id: string, select?: string, clean?: boolean): Promise<UserProfile>
  - getFullUser(id: string, userOptions?: string, profileOptions?: string, clean?: boolean): Promise<User>
  - loginUser(email: string, password: string): Promise<User>
  - logoutUser(id: string): Promise<User>
  - generateToken(user: User): Promise<{accessToken: string, refreshToken: string}>
  - updateUser(id: string, updateData: object, profileUpdateData: object): Promise<{user: User, userProfile: UserProfile}>
  - updateUserProfile(userId: string, profileData: object): Promise<UserProfile>

## UserProfile

- **Attributes:**

  - user: ObjectId (User)
  - testTaken: Array<ObjectId> (Test)
  - testScore: Array<Number>
  - achievements: Array<String>
  - preferences: {notificationSettings, studyReminders}
  - learningGoals: Array<String>
  - targetExams: Array<String>
  - studyPlan: ObjectId (StudyPlan)
  - progressTracking: {
    vocabularyMastered,
    grammarPointsLearned,
    listeningHoursPracticed,
    speakingSessionsCompleted,
    writingAssignmentsSubmitted
    }
  - deviceInfo: Array<{deviceType, lastUsed}>
  - bio: String
  - website: String
  - socialLinks: {twitter, linkedin, github}
  - socialConnections: {studyBuddies, following, followers}
  - feedbackProvided: Array<ObjectId> (Feedback)

- **Methods:**
  - addTestScore(score: number): Promise<UserProfile>
  - updateProgressTracking(field: string, value: number): Promise<UserProfile>
  - getUserProfile(userId: string, select?: string, clean?: boolean): Promise<UserProfile>

## UserStatistics

- **Attributes:**
  - user: ObjectId (User)
  - testsCompleted: {
    total,
    byDifficulty: {easy, medium, hard},
    byType: {practice, exam}
    }
  - averageScores: {
    overall,
    bySection: {reading, listening, writing, speaking}
    }
  - questionStats: {
    totalAttempted,
    correctAnswers,
    byType: {single_choice, multiple_choice, fill_in_the_blank}
    }
  - timeStats: {
    totalTimeSpent,
    averageTestDuration,
    averageQuestionTime
    }
  - progressOverTime: Array<{date, score, testId}>

## Test

- **Attributes:**

  - title: String
  - description: String
  - duration: Number
  - sections: Array<{
    name,
    instructions,
    sectionScore,
    questions,
    duration,
    passages
    }>
  - totalPossibleScore: Number
  - passingScore: Number
  - difficulty: String
  - testType: String
  - createdBy: ObjectId (User)
  - isPublished: Boolean
  - attemptsAllowed: Number
  - availableFrom: Date
  - availableUntil: Date
  - averageRating: Number
  - totalReviews: Number
  - participantCount: Number

- **Methods:**
  - updateAverageRating(): Promise<Test>
  - publish(): Promise<Test>
  - unpublish(): Promise<Test>

## Question (BaseQuestion)

- **Attributes:**

  - section: String (enum: ["reading", "listening", "speaking", "writing", "general", "vocabulary", "grammar"])
  - questionText: String
  - instruction: String
  - isDraft: Boolean
  - isPublic: Boolean
  - points: Number
  - difficulty: Number
  - createdBy: ObjectId (User)

- **Methods:**
  - getQuestionById(id: string, clean?: boolean): Promise<Question>
  - getQuestionsByIds(ids: string[], clean?: boolean, options?: object): Promise<Question[]>
  - getQuestionsBySection(section: string, clean?: boolean): Promise<Question[]>

### MultipleChoiceQuestion extends BaseQuestion

- **Attributes:**
  - answers: Array<String> (2-6 options)
  - correctAnswers: Array<String>

### SingleChoiceQuestion extends BaseQuestion

- **Attributes:**
  - answers: Array<String> (2-6 options)
  - correctAnswer: String

### TrueFalseQuestion extends BaseQuestion

- **Attributes:**
  - correctAnswer: Boolean
  - statement: String

### FillInTheBlankQuestion extends BaseQuestion

- **Attributes:**
  - text: String
  - blanks: Array<{
    index: Number,
    correctAnswer: String,
    options?: Array<String>
    }>

### MatchingQuestion extends BaseQuestion

- **Attributes:**
  - leftColumn: Array<{id: String, text: String}>
  - rightColumn: Array<{id: String, text: String}>
  - correctPairs: Array<{left: String, right: String}>

### OrderingQuestion extends BaseQuestion

- **Attributes:**
  - items: Array<{id: String, text: String}>
  - correctOrder: Array<String>

### OpenEndedQuestion extends BaseQuestion

- **Attributes:**
  - prompt: String

### EssayQuestion extends BaseQuestion

- **Attributes:**
  - minWords: Number (100-1000)
  - maxWords: Number (100-1000)
  - rubric: String

## Passage (BasePassage)

- **Attributes:**
  - passageType: String (enum: ["reading", "listening"])
  - title: String
  - text: String
  - url: String
  - questions: Array<ObjectId> (Question)
  - createdBy: ObjectId (User)

### ReadingPassage extends BasePassage

- **Attributes:** [inherits all from BasePassage]

### ListeningPassage extends BasePassage

- **Attributes:**
  - soundFile: String (required)

## TestAttempt

- **Attributes:**

  - user: ObjectId (User)
  - test: ObjectId (Test)
  - startTime: Date
  - endTime: Date
  - maxEndTime: Date
  - status: String (enum: ["in-progress", "completed", "abandoned"])
  - result: ObjectId (TestResult)
  - totalScore: Number
  - answers: Array<{question, answer}>

- **Methods:**
  - start(testAttempt: TestAttempt, test: Test): Promise<TestAttempt>
  - isTimeUp(testAttempt: TestAttempt): boolean
  - complete(testAttempt: TestAttempt): Promise<TestAttempt>
  - calculateResult(testAttempt: TestAttempt): Promise<TestResult>
  - calculateScore(questionData: object, answer: object, point: number, testType?: string): Promise<number>
  - sanitizeJsonString(jsonString: string): string

## TestResult

- **Attributes:**

  - testAttempt: ObjectId (TestAttempt)
  - user: ObjectId (User)
  - test: ObjectId (Test)
  - totalScore: Number
  - maxTotalScore: Number
  - scorePercentage: Number
  - totalQuestions: Number
  - sectionScores: Array<{sectionType, score, totalQuestions}>
  - questionScores: Array<{\_id, score}>
  - writingQuestionResults: Array<WritingQuestionResult>
  - speakingResult: {
    fluency,
    pronunciation,
    vocabulary,
    overallCommunication,
    totalScore,
    feedback
    }
  - feedback: String
  - gradedBy: ObjectId (User)
  - gradedAt: Date

- **Methods:**
  - addFeedback(feedback: string, graderId: ObjectId): Promise<TestResult>

## Review

- **Methods:**
  - createReview(data: {test: string, user: string, rating?: object, comment?: string}): Promise<Review>
  - updateRating(data: {test: string, user: string, rating: object}): Promise<Review>
  - addComment(data: {test: string, user: string, comment: string}): Promise<Review>

## Relationships

- User ---> UserProfile (1:1)
- User ---> UserStatistics (1:1)
- User ---> Test (1:N as creator)
- User ---> Question (1:N as creator)
- User ---> TestAttempt (1:N)
- User ---> TestResult (1:N as taker, 1:N as grader)
- Test ---> Question (1:N)
- TestAttempt ---> TestResult (1:1)
- Test ---> Review (1:N)
