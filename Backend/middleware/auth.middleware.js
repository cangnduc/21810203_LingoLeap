const { UnauthorizedError, ForbiddenError } = require("../helpers/error");
const UserFunctions = require("../model/function/user.function");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");

const authMiddleware = (allowedRoles = []) =>
  asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Unauthorized Access");
    }

    const { decoded, error } = await new Promise((resolve) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          resolve({ decoded: null, error: err });
        } else {
          resolve({ decoded, error: null });
        }
      });
    });

    if (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Access token has expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid access token");
      } else {
        throw new UnauthorizedError("Unauthorized Access");
      }
    }

    const user = await UserFunctions.getUserById(
      decoded.id,
      "role _id email username",
      true
    );

    req.user = user;

    // Check if the user's role is allowed
    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role.toLowerCase())
    ) {
      throw new ForbiddenError(
        "You do not have permission to access this resource"
      );
    }

    next();
  });
// Remove the roleMiddleware export as it's no longer needed
module.exports = { authMiddleware };
