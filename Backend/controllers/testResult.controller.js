const TestResultService = require("../services/testResult.service");
const Response = require("../helpers/response");

class TestResultController {
  async getTestResultsByUser(req, res, next) {
    const { userId } = req.user;
    const testResult = await TestResultService.getTestResultByUser(userId);

    Response.sendSuccess(res, "Test result fetched successfully", {
      testResult,
    });
  }
  async getTestResultByAttemptId(req, res, next) {
    const { attemptId } = req.params;
    const testResult = await TestResultService.getTestResultByAttemptId(
      attemptId
    );
    console.log("testResult", testResult);
    Response.sendSuccess(res, "Test result fetched successfully", {
      testResult,
    });
  }
}

module.exports = new TestResultController();
