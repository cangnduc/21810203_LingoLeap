const { wrapAsyncRoutes } = require("../helpers/asyncHandler");
const Response = require("../helpers/response");
const Test = require("../model/test.model");

class TestController {
  async addTest(req, res) {
    const { user } = req;

    const {
      title,
      description,
      duration,
      sections,
      difficulty,
      isPublished,
      attemptsAllowed,
      availableFrom,
      availableUntil,
    } = req.body;
    const newTest = new Test({
      title,
      description,
      duration,
      sections,
      difficulty,
      isPublished,
      attemptsAllowed,
      availableFrom,
      availableUntil,
      createdBy: user._id,
    });
    await newTest.save();
    Response.sendSuccess(res, "Test added successfully", newTest);
  }
}

module.exports = wrapAsyncRoutes(new TestController());
