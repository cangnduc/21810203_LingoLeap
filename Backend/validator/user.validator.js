const z = require("zod");

// Common regex patterns
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

// Base schemas for reuse
const addressSchema = z
  .object({
    street: z.string().min(1, "Street is required").max(100),
    city: z.string().min(1, "City is required").max(50),
    country: z.string().min(1, "Country is required").max(50),
  })
  .partial();

// User creation schema
const createUserSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    username: z
      .string()
      .regex(
        usernameRegex,
        "Username must be 3-20 characters and can only contain letters, numbers, and underscores"
      ),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: z.string(),
    role: z.enum(["user", "teacher", "admin"]).default("user"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// User update schema
const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  username: z.string().regex(usernameRegex).optional(),
  role: z.enum(["user", "teacher"]).optional(),

  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .optional(),
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Invalid phone number format")
    .optional(),
  address: addressSchema.optional(),
});

// Password change schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .regex(
        passwordRegex,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  });

module.exports = {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
};
