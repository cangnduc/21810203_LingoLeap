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

    // Build filter object using $or to combine conditions
    const filter = {
      $or: [
        { isPublished: true },
        { createdBy: req.user?._id }, // Get all tests created by current user
      ],
    };

    // Add additional filters
    if (difficulty) filter.difficulty = difficulty;
    if (testType) filter.testType = testType;
    if (createdBy === "me" && req.user) {
      // Override $or filter if specifically requesting user's tests
      delete filter.$or;
      filter.createdBy = req.user._id;
    }
    console.log("filter", filter);
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Get total count for pagination
    const totalTests = await Test.countDocuments(filter);
    const totalPages = Math.ceil(totalTests / limitNum);

    // Create the base query
    let query = Test.find(filter);
    console.log("query", query);
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
    console.log("tests", tests);
    const testAttempts = await TestAttempt.find({
      test: { $in: tests.map((test) => test._id) },
      user: req.user._id,
    }).lean();

    const attemptsByTest = testAttempts.reduce((acc, attempt) => {
      acc[attempt.test] = (acc[attempt.test] || 0) + 1;
      return acc;
    }, {});

    tests.forEach((test) => {
      test.totalAttempts = attemptsByTest[test._id] || 0;
    });
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
    //count the test attempts of user
    const testAttempts = await TestAttempt.countDocuments({
      test: id,
      user: req.user._id,
    });
    test.totalAttempts = testAttempts;
    console.log("testAttempts", testAttempts);
    Response.sendSuccess(res, "Test fetched successfully", test);
  }
  async getTestById(req, res) {
    const { id } = req.params;
    const test = await Test.findById(id)
      .select(
        "-__v -createdAt -updatedAt -averageRating -totalReviews -totalAttempts"
      )
      .lean();

    Response.sendSuccess(res, "fetched test by id successfully", test);
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

  async togglePublished(req, res) {
    const { id } = req.params;
    const { user } = req;

    // Only select fields we need for validation and updating
    const test = await Test.findById(id).select("isPublished createdBy");
    if (!test) {
      throw new NotFoundError("Test not found");
    }

    // Check if user has permission to publish
    if (test.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError("You are not authorized to publish this test");
    }

    test.isPublished = !test.isPublished;
    await test.save();

    Response.sendSuccess(res, "Test published successfully", test);
  }

  async updateTest(req, res) {
    const { id } = req.params;
    const { user } = req;

    const validatedUpdate = TestValidator.safeParse(req.body);
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
    console.log("test.createdBy", test.createdBy.toString());
    console.log("user._id", user);
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
