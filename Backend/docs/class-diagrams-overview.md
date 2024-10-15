# Class Diagrams Overview

This document provides an overview of all the models (classes) in our English Testing App.

## User

- **Attributes:**

  - username: String
  - email: String
  - password: String
  - phone: String
  - address: String
  - avatar: String
  - status: String
  - isVerified: Boolean
  - isDeleted: Boolean
  - role: String
  - isOnline: Boolean
  - lastLogin: Date
  - lastLogout: Date
  - lastActivity: Date
  - profile: ObjectId (UserProfile)
  - subscription: ObjectId (Subscription)

- **Methods:**
  - verifyPassword(password: string): Promise<boolean>
  - generateAuthToken(): string
  - softDelete(): Promise<User>

## UserProfile

- **Attributes:**

  - user: ObjectId (User)
  - testTaken: Array<ObjectId> (Test)
  - testScore: Array<Number>
  - achievements: Array<String>
  - preferences: Object
  - learningGoals: Array<String>
  - targetExams: Array<String>
  - studyPlan: ObjectId (StudyPlan)
  - progressTracking: Object
  - deviceInfo: Array<Object>
  - socialConnections: Object
  - feedbackProvided: Array<ObjectId> (Feedback)

- **Methods:**
  - addTestScore(score: number): Promise<UserProfile>
  - updateProgressTracking(field: string, value: number): Promise<UserProfile>

## Subscription

- **Attributes:**

  - user: ObjectId (User)
  - plan: Object
  - paymentHistory: Array<Object>
  - isActive: Boolean

- **Methods:**

  - renewSubscription(planType: string, expiryDate: Date): Promise<Subscription>
  - cancelSubscription(): Promise<Subscription>

- **Virtuals:**
  - isExpired: Boolean

## Course

- **Attributes:**

  - title: String
  - description: String
  - instructor: ObjectId (User)
  - students: Array<ObjectId> (User)
  - lessons: Array<Object>
  - tests: Array<ObjectId> (Test)
  - level: String
  - duration: Number
  - isPublished: Boolean

- **Methods:**

  - enroll(studentId: ObjectId): Promise<Course>
  - unenroll(studentId: ObjectId): Promise<Course>

- **Virtuals:**
  - studentCount: Number
  - lessonCount: Number

## Test

- **Attributes:**

  - title: String
  - description: String
  - duration: Number
  - totalScore: Number
  - sections: Array<Object>
  - createdBy: ObjectId (User)
  - isPublished: Boolean

- **Methods:**

  - publish(): Promise<Test>
  - unpublish(): Promise<Test>

- **Virtuals:**
  - questionCount: Number

## Question

- **Attributes:**

  - type: String
  - questionText: String
  - options: Array<String>
  - correctAnswer: String
  - audioFile: String
  - imageFile: String
  - scoringRubric: String
  - difficulty: String
  - createdBy: ObjectId (User)

- **Methods:**

  - isMultipleChoice(): Boolean

- **Virtuals:**
  - hasAudio: Boolean
  - hasImage: Boolean

## TestAttempt

- **Attributes:**

  - user: ObjectId (User)
  - test: ObjectId (Test)
  - startTime: Date
  - endTime: Date
  - score: Number
  - answers: Array<Object>
  - status: String
  - result: ObjectId (TestResult)

- **Methods:**
  - calculateScore(): Number
  - complete(): Promise<TestAttempt>

## TestResult

- **Attributes:**

  - testAttempt: ObjectId (TestAttempt)
  - user: ObjectId (User)
  - test: ObjectId (Test)
  - totalScore: Number
  - sectionScores: Array<Object>
  - feedback: String
  - gradedBy: ObjectId (User)
  - gradedAt: Date

- **Methods:**

  - addFeedback(feedback: string, graderId: ObjectId): Promise<TestResult>

- **Virtuals:**
  - isPassing: Boolean

## Relationships

- User ---> UserProfile (1:1)
- User ---> Subscription (1:1)
- User ---> Course (1:N as instructor, M:N as student)
- User ---> Test (1:N as creator)
- User ---> Question (1:N as creator)
- User ---> TestAttempt (1:N)
- User ---> TestResult (1:N as taker, 1:N as grader)
- Course ---> Test (1:N)
- Test ---> Question (1:N)
- TestAttempt ---> TestResult (1:1)

This class diagram overview provides a high-level understanding of the data model for our English Testing App. Each class represents a MongoDB document, and the relationships between them are managed through ObjectId references.
