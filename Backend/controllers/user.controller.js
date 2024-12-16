const UserFunctions = require("../model/function/user.function");
const UserProfileFunctions = require("../model/function/profile.function");
const { UnauthorizedError } = require("../helpers/error");
const { wrapAsyncRoutes } = require("../helpers/asyncHandler");
const Response = require("../helpers/response");
const {
  updateProfileSchema,
  changePasswordSchema,
  updateUserSchema,
} = require("../validator/user.validator");

class UserController {
  // Get user profile by userId for admin
  async getProfileByUserId(req, res) {
    const userProfile = await UserProfileFunctions.getUserProfile(
      req.params.id,
      "-_id -__v -createdAt -updatedAt",
      true
    );
    Response.sendSuccess(res, "User profile fetched successfully", userProfile);
  }

  // get current user profile
  async getCurrentUserProfile(req, res) {
    console.log("userid", req.user._id.toString());
    const userProfile = await UserProfileFunctions.getUserProfile(
      req.user._id.toString(),
      "-_id -__v -createdAt -updatedAt",
      true
    );
    Response.sendSuccess(res, "User profile fetched successfully", userProfile);
  }

  // update user profile
  async updateProfile(req, res) {
    const validatedData = updateProfileSchema.parse(req.body);
    const updatedProfile = await UserFunctions.updateUserProfile(
      req.user.id,
      validatedData
    );
    res.json(updatedProfile);
  }

  async changePassword(req, res) {
    const validatedData = changePasswordSchema.parse(req.body);
    // Implement password change logic
    res.json({ message: "Password changed successfully" });
  }

  async deleteAccount(req, res) {
    // Implementation
  }

  async getAllUsers(req, res) {
    // Implementation (admin only)
  }

  async getCurrentUser(req, res) {
    const user = await UserFunctions.getUserById(
      req.user._id,
      "_id username email avatar firstName lastName phoneNumber address",
      true
    );
    Response.sendSuccess(res, "User fetched successfully", user);
  }

  async getFullCurrentUser(req, res) {
    const user = await UserFunctions.getFullUser(
      req.user._id,
      "-_id -__v -isDeleted -isVerified -password -createdAt -updatedAt",
      "-_id -__v -createdAt -updatedAt",
      true
    );
    Response.sendSuccess(res, "User fetched successfully", user);
  }

  // Keep these for admin access
  async getUserById(req, res) {
    const { id } = req.params;
    if (req.user.role !== "admin") {
      throw new UnauthorizedError("Admin access required");
    }
    const user = await UserFunctions.getUserById(
      id,
      "_id username email avatar firstName lastName phoneNumber address",
      true
    );
    Response.sendSuccess(res, "User fetched successfully", user);
  }

  async getFullUser(req, res) {
    const { id } = req.params;
    if (req.user.role !== "admin") {
      throw new UnauthorizedError("Admin access required");
    }
    const user = await UserFunctions.getFullUser(
      id,
      "-_id -__v -createdAt -updatedAt",
      "-_id -__v -createdAt -updatedAt",
      true
    );
    Response.sendSuccess(res, "User fetched successfully", user);
  }

  async updateUserRole(req, res) {
    // Implementation (admin only)
  }

  async addTestScore(req, res) {
    // Implementation
  }

  async updateProgressTracking(req, res) {
    // Implementation
  }

  async addLearningGoal(req, res) {
    // Implementation
  }

  async removeLearningGoal(req, res) {
    // Implementation
  }

  async updatePreferences(req, res) {
    // Implementation
  }

  async addSocialConnection(req, res) {
    // Implementation
  }

  async removeSocialConnection(req, res) {
    // Implementation
  }

  async updateCurrentUser(req, res) {
    const validatedData = updateUserSchema.parse(req.body);
    const updatedUser = await UserFunctions.updateUser(
      req.user._id,
      validatedData
    );
    Response.sendSuccess(res, "User updated successfully", updatedUser);
  }
}

module.exports = wrapAsyncRoutes(new UserController());
