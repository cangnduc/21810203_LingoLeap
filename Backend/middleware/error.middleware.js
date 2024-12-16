const { ZodError } = require("zod");
const {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ErrorRedirect,
  NotFoundError,
} = require("../helpers/error");
const { MongoServerError } = require("mongodb");
const handleError = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.errors,
    });
  }
  if (err instanceof BadRequestError) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.message,
    });
  }
  if (err instanceof ErrorRedirect) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.message,
      redirect: err.redirect,
    });
  }
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.message,
    });
  }
  if (!(err instanceof AppError)) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      code: 500,
      errors: err.message,
    });
  }
  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      code: 403,
      errors: err.message,
    });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      code: 401,
      errors: err.message,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      message: "Not Found",
      code: 404,
      errors: err.message,
    });
  }
  if (err instanceof MongoServerError) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.message,
    });
  }
  console.log(err);
  res.status(err.code).json({
    success: false,
    message: err.message,
    code: err.code,
    errors: err.errors,
  });
};
module.exports = handleError;
