class AppError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;

    Error.captureStackTrace(this, this.constructor); //
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not Found", code = 404, status = "error") {
    super(message, code, status);
  }
}

class BadRequestError extends AppError {
  constructor(
    message = "Bad Request",
    code = 400,
    status = "error",
    originalError = null
  ) {
    super(message, code, status);
    this.originalError = originalError;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", code = 401, status = "error") {
    super(message, code, status);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code = 403, status = "error") {
    super(message, code, status);
  }
}
class ErrorRedirect extends AppError {
  constructor(
    message = "Error Redirect",
    code = 400,
    status = "error",
    redirect = null
  ) {
    super(message, code, status);
    this.redirect = redirect;
  }
}
class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", originalError = null) {
    super(message, 500, "error");
    this.originalError = originalError;
  }
}

module.exports = {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
  ErrorRedirect,
};
