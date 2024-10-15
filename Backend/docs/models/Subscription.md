# Subscription Model

## Schema

- user: ObjectId (ref: "User", required, unique)
- plan:
  - type: String (enum: ["free", "basic", "premium"], required, default: "free")
  - expiryDate: Date (required for non-free plans)
- paymentHistory: Array of:
  - amount: Number (required, min: 0)
  - date: Date (required, default: current date)
  - planType: String (enum: ["basic", "premium"], required)
- isActive: Boolean (default: true)

## Relationships

- Belongs to one User

## Methods

- `renewSubscription(planType: string, expiryDate: Date): Promise<Subscription>`
- `cancelSubscription(): Promise<Subscription>`

## Virtuals

- `isExpired: boolean` (true if plan is not free and expiry date has passed)

## Indexes

- { user: 1 } (unique)
- { "plan.type": 1 }
- { isActive: 1 }

## Validation

- User reference is required and unique
- Subscription type must be one of ["free", "basic", "premium"]
- Expiry date is required for non-free plans
- Payment amount must be non-negative
- Payment plan type must be either "basic" or "premium"

## Timestamps

- Created at
- Updated at
