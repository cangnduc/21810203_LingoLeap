# Database Models Class Diagram

mermaid
classDiagram
class User {
+String email
+String username
+String password
+String avatar
+Boolean isVerified
+Boolean isDeleted
+String role
+ObjectId userProfile
+comparePassword()
}
class UserProfile {
+ObjectId user
+String firstName
+String lastName
+Date dateOfBirth
+String phoneNumber
+Object address
+Array testTaken
+Array testScore
+Array achievements
+Object preferences
+Array learningGoals
+Array targetExams
+ObjectId studyPlan
+Object progressTracking
+Array deviceInfo
+Object socialConnections
+Array feedbackProvided
+addTestScore()
+updateProgressTracking()
}
class Course {
+String title
+String description
+ObjectId instructor
+Array students
+Array lessons
+Array tests
+String level
+Number duration
+Boolean isPublished
+enroll()
+unenroll()
}
class Test {
+String title
+String description
+Number duration
+Array sections
+Number totalPossibleScore
+Number passingScore
+String difficulty
+String testType
+ObjectId createdBy
+Boolean isPublished
+Number attemptsAllowed
+Date availableFrom
+Date availableUntil
+Number averageRating
+Number totalReviews
+Number totalAttempts
+updateAverageRating()
+publish()
+unpublish()
}
class TestAttempt {
+ObjectId user
+ObjectId test
+Date startTime
+Date endTime
+Date maxEndTime
+String status
+ObjectId result
+Number totalScore
+Array answers
+start()
+isTimeUp()
+complete()
+calculateResult()
+calculateScore()
}
class TestResult {
+ObjectId testAttempt
+ObjectId user
+ObjectId test
+Number totalScore
+Number maxTotalScore
+Number scorePercentage
+Number totalQuestions
+Array sectionScores
+Array questionScores
+Array writingQuestionResults
+String feedback
+ObjectId gradedBy
+Date gradedAt
+addFeedback()
}
class Question {
+String section
+String type
+String questionText
+String instruction
+Mixed correctAnswer
+Array correctAnswers
+Array answers
+Number difficulty
+ObjectId createdBy
+Boolean isPublic
+isMultipleChoice()
+isSingleChoice()
+setReadingPassage()
}
class LoginSession {
+ObjectId user
+String deviceInfo
+String ipAddress
+String refreshToken
+Boolean isActive
+Date lastActivity
+Date expiresAt
+Boolean refreshTokenUsed
+String clientId
+updateLastActivity()
+deactivate()
+rotateRefreshToken()
+markRefreshTokenAsUsed()
+useAndRotateToken()
}
User "1" -- "1" UserProfile
User "1" -- "" LoginSession
User "1" -- "" TestAttempt
User "1" -- "" Course : instructs
Course "" -- "" User : enrolls
Course "1" -- "" Test
Test "1" -- "" TestAttempt
TestAttempt "1" -- "1" TestResult
Test "" -- "" Question
Question "" -- "1" User : creates
