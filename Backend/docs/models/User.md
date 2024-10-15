# User Model

## Schema

- username: String (required, 3-30 characters)
- email: String (required, unique, lowercase, trimmed)
- password: String (required for local auth, min length: 8)
- phone: String (required, unique, valid phone format)
- address: String (required)
- avatar: String (required)
- status: String (enum: ["active", "inactive", "suspended"], default: "active")
- isVerified: Boolean (default: false)
- isDeleted: Boolean (default: false)
- role: String (enum: ["student", "teacher", "admin", "guest"], default: "guest")
- isOnline: Boolean (default: false)
- lastLogin: Date
- lastLogout: Date
- lastActivity: Date
- profile: ObjectId (ref: "UserProfile")
- subscription: ObjectId (ref: "Subscription")
- authMethod: String (enum: ['local', 'google'], required, default: 'local')
- googleId: String (unique, sparse)

## Relationships

- Has one UserProfile
- Has one Subscription
- Can have many TestAttempts
- Can have many TestResults (as a student)
- Can grade many TestResults (as a teacher)
- Can create many Courses (as a teacher)
- Can enroll in many Courses (as a student)

## Methods

- `verifyPassword(password: string): Promise<boolean>`
- `generateAuthToken(): string`
- `softDelete(): Promise<User>`

## Indexes

- email: 1 (unique)
- username: 1 (unique)
- phone: 1 (unique)

## Hooks

- Pre-save: Hash password
- Pre-remove: Remove associated UserProfile and Subscription

## Validation

- Username: 3-30 characters
- Email: Valid email format
- Password: Minimum 8 characters
- Phone: Valid phone number format
- Status: Must be one of ["active", "inactive", "suspended"]
- Role: Must be one of ["student", "teacher", "admin", "guest"]

## Notes

- The `authMethod` field indicates whether the user signed up using local authentication or Google OAuth.
- The `password` field is only required if `authMethod` is 'local'.
- The `googleId` field is unique but not required (sparse index), and is only used for Google OAuth users.
