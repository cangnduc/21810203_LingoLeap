const z = require("zod");

const signupSchema = z.object({
  email: z.string().email(),

  username: z.string().min(3).max(20),
  password: z.string().min(8),
  role: z.enum(["admin", "user", "teacher"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

module.exports = {
  signupSchema,
  loginSchema,
};
