# Guest Use Cases

## Actor Description

An unauthenticated user with limited access to system features.

## Characteristics

- No authentication required
- Limited access to public content
- Cannot save progress
- Cannot take full tests

## Primary Use Cases

### UC-G1: Browse Available Tests

**Preconditions:**

- None

**Basic Flow:**

1. Guest accesses the platform
2. System displays public test catalog
3. Guest can view test descriptions
4. Guest can filter tests by type/level
5. System shows limited test details

**Alternative Flows:**

- A1: Guest uses search functionality
- A2: Guest applies filters

**Postconditions:**

- Guest views available tests
- System maintains anonymity

**Exceptions:**

- E1: Connection error
- E2: Invalid filter parameters

### UC-G2: Register Account

**Preconditions:**

- Guest has valid email address

**Basic Flow:**

1. Guest clicks "Register"
2. System displays registration form
3. Guest enters required information:
   - Username
   - Email
   - Password
   - Basic profile details
4. System validates input
5. System creates account
6. System sends verification email

**Alternative Flows:**

- A1: Social media registration
- A2: Guest cancels registration

**Postconditions:**

- New user account created
- Verification email sent
- Guest redirected to login

**Exceptions:**

- E1: Email already exists
- E2: Invalid data format
- E3: System error

### UC-G3: Access Sample Tests

**Preconditions:**

- None

**Basic Flow:**

1. Guest selects "Sample Tests"
2. System displays available samples
3. Guest selects a sample test
4. System provides limited test experience
5. Guest completes sample questions

**Alternative Flows:**

- A1: Guest exits sample test
- A2: Guest views multiple samples

**Postconditions:**

- Sample test experience provided
- No data saved

**Exceptions:**

- E1: Sample test unavailable
- E2: Browser compatibility issues

## Relationships

### Includes

- View Test Details (included in Browse Tests)
- Validate Email (included in Register)

### Extends

- Preview Test Content (extends Browse Tests)
- Social Registration (extends Register Account)

## Constraints

- Cannot access premium content
- Limited to sample test features
- No progress saving
- No personalization features
