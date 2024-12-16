const z = require("zod");

const createReviewSchema = z.object({
  test: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid test ID"),
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  rating: z
    .object({
      value: z.number().int().min(1).max(5),
    })
    .optional(),
  comment: z.string().max(500),
});

const addCommentSchema = z.object({
  test: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid test ID"),
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  comment: z.string().max(500),
});

const updateRatingSchema = z.object({
  test: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid test ID"),
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  rating: z.object({
    value: z.number().int().min(1).max(5),
  }),
});

module.exports = {
  createReviewSchema,
  addCommentSchema,
  updateRatingSchema,
};
