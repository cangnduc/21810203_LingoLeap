const { wrapAsyncRoutes } = require("../helpers/asyncHandler");
const Response = require("../helpers/response");
const Test = require("../model/test.model.v1");
const { TestValidator } = require("../validator/test.validator");
const { BadRequestError, ForbiddenError } = require("../helpers/error");
const Question = require("../model/question.model");
const TestAttempt = require("../model/testAttempt.model");
const Review = require("../model/review.model");
class TestController {
  async getTests(req, res) {
    const {
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      sortBy = "desc",
      difficulty,
      testType,
      createdBy,
    } = req.query;

    // Build filter object based on query parameters
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (testType) filter.testType = testType;
    if (createdBy === "me" && req.user) {
      filter.createdBy = req.user._id;
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Get total count for pagination
    const totalTests = await Test.countDocuments(filter);
    const totalPages = Math.ceil(totalTests / limitNum);

    // Create the base query
    let query = Test.find(filter);

    // Normal sorting for other fields
    query = query
      .sort({ [orderBy]: sortBy === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Execute the query with population
    const tests = await query
      .select("-__v -createdAt -updatedAt")
      .populate({
        path: "createdBy",
        model: "User",
        select: "username",
      })
      .lean();

    // Send response with pagination metadata
    Response.sendSuccess(res, "Tests fetched successfully", {
      data: tests,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalTests,
        limit: limitNum,
      },
    });
  }

  async addTest(req, res) {
    const { user } = req;
    const validatedTest = TestValidator.safeParse(req.body);
    if (!validatedTest.success) {
      const errorMessages = validatedTest.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessages", errorMessages);
      throw new BadRequestError(errorMessages);
    }

    const testData = validatedTest.data;
    console.log("testData", testData);

    const newTest = new Test({
      ...testData,
      createdBy: user._id,
    });

    await newTest.save();

    Response.sendSuccess(res, "Test added successfully", newTest);
  }

  async getTest(req, res) {
    const { id } = req.params;
    const test = await Test.findById(id)
      .populate({
        path: "sections.questions._id",
        model: "Question",
        select:
          "-createdAt -updatedAt -__v -difficulty -isDraft -isPublic -createdBy", // Unselect these fields
      })
      .populate({
        path: "sections.passages._id",
        model: "BasePassage",
        select: "-createdAt -updatedAt -__v", // Unselect these fields
        populate: {
          path: "questions",
          model: "Question",
          select:
            "-createdAt -updatedAt -__v -difficulty -isDraft -isPublic -createdBy", // Unselect these fields
        },
      })
      .select("-__v -createdAt -updatedAt") // Unselect these fields from the main document
      .lean();

    if (!test) {
      throw new NotFoundError("Test not found");
    }

    Response.sendSuccess(res, "Test fetched successfully", test);
  }
  async deleteTest(req, res) {
    const { id } = req.params;
    const { user } = req;

    // Find and verify test exists
    const test = await Test.findById(id).select("createdBy").lean();
    if (!test) {
      throw new NotFoundError("Test not found");
    }

    // Verify user has permission to delete
    if (test.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError("You are not authorized to delete this test");
    }

    // Delete the test
    await Test.findByIdAndDelete(id);

    // Delete associated test attempts
    await TestAttempt.deleteMany({ test: id });

    // Delete associated reviews
    await Review.deleteMany({ test: id });

    Response.sendSuccess(res, "Test and associated data deleted successfully");
  }

  async getTestForAttempt(req, res) {
    const selectAttribute = `
      type instruction questionText
      answer
      answers
      text blanks
      leftColumn rightColumn
      items
      prompt
      minWords maxWords rubric
    `;
    const { id } = req.params;
    const test = await Test.findById(id)
      .select("title duration description testType sections attemptsAllowed")
      .populate({
        path: "sections.questions._id",
        model: "Question",
        // Select common fields and all possible type-specific fields
        select: selectAttribute,
      })
      .populate({
        path: "sections.passages._id",
        model: "BasePassage",
        select: "text title passageType url soundFile", // soundFile only exists for listening passages
        populate: {
          path: "questions",
          model: "Question",
          select: selectAttribute,
        },
      })
      .lean();

    if (!test) {
      throw new NotFoundError("Test not found");
    }

    // Additional validations specific to test attempts
    const existingAttempts = await TestAttempt.countDocuments({
      test: id,
      user: req.user._id,
      status: { $in: ["completed", "in-progress"] },
    });

    if (existingAttempts >= test.maxAttempts) {
      throw new ForbiddenError("Maximum attempts reached for this test");
    }

    Response.sendSuccess(res, "Test fetched successfully", test);
  }

  async publishTest(req, res) {
    const { id } = req.params;
    const { user } = req;

    // Only select fields we need for validation and updating
    const test = await Test.findById(id).select(
      "isPublished sections createdBy"
    );
    if (!test) {
      throw new NotFoundError("Test not found");
    }

    // Check if user has permission to publish
    if (test.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError("You are not authorized to publish this test");
    }

    // Add any additional validation before publishing
    if (test.sections.length === 0) {
      throw new BadRequestError("Cannot publish a test without any sections");
    }

    test.isPublished = true;
    await test.save();

    Response.sendSuccess(res, "Test published successfully", test);
  }

  async updateTest(req, res) {
    const { id } = req.params;
    const { user } = req;

    const validatedUpdate = TestValidator.partial().safeParse(req.body);
    if (!validatedUpdate.success) {
      const errorMessages = validatedUpdate.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new BadRequestError(errorMessages);
    }

    // Only select fields we need for validation
    const test = await Test.findById(id).select("createdBy");
    if (!test) {
      throw new NotFoundError("Test not found");
    }

    if (test.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError("You are not authorized to update this test");
    }

    // Use findByIdAndUpdate for a more efficient update
    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { $set: validatedUpdate.data },
      { new: true } // Return the updated document
    );

    Response.sendSuccess(res, "Test updated successfully", updatedTest);
  }
}

module.exports = new TestController();
