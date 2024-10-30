const { wrapAsyncRoutes } = require("../helpers/asyncHandler");
const Response = require("../helpers/response");
const Test = require("../model/test.model");
const { TestValidator } = require("../validator/test.validator");
const { BadRequestError, ForbiddenError } = require("../helpers/error");
const Question = require("../model/question.model");

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
    //await Test.findByIdAndDelete(id);
    const test = await Test.findById(id);
    if (!test) {
      throw new NotFoundError("Test not found");
    }
    if (test.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError("You are not authorized to delete this test");
    }

    console.log(`Simulated deletion of test with ID: ${id}`);
    Response.sendSuccess(res, "Test deleted successfully");
  }
}

module.exports = new TestController();
