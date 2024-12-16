# Student Use Cases

## Actor Description

An authenticated user who can take tests, track progress, and access learning resources.

## Characteristics

- Has verified account
- Can have active subscription
- Can track learning progress
- Can take full tests
- Inherits Guest capabilities

## Primary Use Cases

### UC-S1: Take Full Test

**Preconditions:**

- Student is authenticated
- Has valid subscription (if required)
- Test is available
- Has remaining attempts

**Basic Flow:**

1. Student selects test from catalog
2. System verifies eligibility
3. Student starts test session
4. For each section:
   - System displays instructions
   - System presents questions
   - Student submits answers
   - System tracks time
5. Student reviews answers
6. Student submits test
7. System processes results

**Alternative Flows:**

- A1: Save and Continue Later
  1. Student saves progress
  2. System stores current state
  3. Student can resume later
- A2: Time Extension Request
  1. Student requests more time
  2. System evaluates eligibility
  3. System grants/denies extension

**Postconditions:**

- Test attempt recorded
- Results calculated
- Progress updated
- Performance statistics updated

**Exceptions:**

- E1: Connection lost during test
- E2: Time expired
- E3: Maximum attempts reached
- E4: Subscription expired

### UC-S2: Manage Learning Progress

**Preconditions:**

- Student is authenticated
- Has completed at least one test/lesson

**Basic Flow:**

1. Student accesses dashboard
2. System displays:
   - Overall progress
   - Test history
   - Skill levels
   - Achievement badges
3. Student can:
   - View detailed analytics
   - Set learning goals
   - Track achievements
   - Access study recommendations

**Alternative Flows:**

- A1: Generate Progress Report
- A2: Share Achievements
- A3: Update Learning Goals

**Postconditions:**

- Progress data updated
- Learning path adjusted
- Recommendations refreshed

**Exceptions:**

- E1: Data synchronization error
- E2: Invalid progress calculation

## Relationships

### Includes

- Verify Subscription (included in Take Test)
- Track Progress (included in all learning activities)
- Save Progress (included in Take Test)

### Extends

- Practice Mode (extends Take Test)
- Detailed Analytics (extends View Progress)
- Peer Comparison (extends View Results)

## Constraints

- Test attempts limited by subscription
- Resource access based on subscription level
- Must complete prerequisites for advanced tests
- Time limits on test sessions
