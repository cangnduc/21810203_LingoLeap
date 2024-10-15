const { BaseQuestion } = require("../question.model.v1");
const { NotFoundError, UnauthorizedError } = require("../../helpers/error");
const { accessTokenTime, refreshTokenTime } = require("../../constant/value");
const jwt = require("jsonwebtoken");
class QuestionFunctions {
  // Get a question by id
  async getQuestionById(id, clean = false) {
    if (clean) {
      return await BaseQuestion.findById(id).lean();
    }
    return await BaseQuestion.findById(id);
  }
  async getQuestionsByIds(ids, clean = false, options = {}) {
    if (clean) {
      return await BaseQuestion.find({ _id: { $in: ids } })
        .select(options.unselect ? `-${options.unselect.join(" -")}` : "")
        .lean();
    }
    return await BaseQuestion.find({ _id: { $in: ids } }).select(
      options.unselect ? `-${options.unselect.join(" -")}` : ""
    );
  }
  async getQuestionsBySection(section, clean = false) {
    if (clean) {
      return await BaseQuestion.find({ section }).lean();
    }
    return await BaseQuestion.find({ section });
  }
}
module.exports = new QuestionFunctions();
