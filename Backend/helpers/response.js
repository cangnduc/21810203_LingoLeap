//define the response for the api
const { code, status: statusEnum } = require("../constant/codeStatus");
const { BadRequestError } = require("./error");
const { ZodError } = require("zod");
class Response {
  static sendSuccess(res, message = "Success", data = null, code = 200) {
    const response = {
      status: code,
      message,
      data,
    };
    return res.status(response.status).json(response);
  }

  static sendError(res, error) {
    //check if the error is an instance of BadRequestError

    const response = {
      status: error.status || "error",
      message: error.message,
      code: error.code || 500,
    };

    if (process.env.NODE_ENV === "development" && error.stack) {
      response.stack = error.stack;
    }

    return res.status(response.code).json(response);
  }
}

module.exports = Response;
