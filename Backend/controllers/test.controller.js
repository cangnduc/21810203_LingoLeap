const { wrapAsyncRoutes } = require("../helpers/asyncHandler");
const Response = require("../helpers/response");
const Test = require("../model/test.model");
const { TestValidator } = require("../validator/test.validator");
const { BadRequestError } = require("../helpers/error");
const Question = require("../model/question.model");
class TestController {
  async getTests(req, res) {
    const {
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      sortBy = "desc",
    } = req.query;
    const tests = await Test.find()
      .sort({ [orderBy]: sortBy === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v -createdAt -updatedAt")
      .lean();
    Response.sendSuccess(res, "Tests fetched successfully", tests);
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
}

module.exports = new TestController();
