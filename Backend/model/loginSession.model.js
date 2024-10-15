const mongoose = require("mongoose");

const loginSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceInfo: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    refreshTokenUsed: {
      type: Boolean,
      default: false,
    },
    clientId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    expireAfterSeconds: 7 * 24 * 60 * 60, // 7 days in seconds
  }
);

// Index for faster queries
loginSessionSchema.index({ user: 1, isActive: 1 });
loginSessionSchema.index({ refreshToken: 1 });

// Method to update last activity
loginSessionSchema.methods.updateLastActivity = function () {
  this.lastActivity = Date.now();
  return this.save();
};

// Method to deactivate session
loginSessionSchema.methods.deactivate = function () {
  this.isActive = false;
  return this.save();
};

// Add a method to rotate the refresh token
loginSessionSchema.methods.rotateRefreshToken = function (newRefreshToken) {
  this.refreshToken = newRefreshToken;
  return this.save();
};

// Add a method to mark the token as used
loginSessionSchema.methods.markRefreshTokenAsUsed = function () {
  this.refreshTokenUsed = true;
  return this.save();
};

// Add a static method to revoke all sessions for a user
loginSessionSchema.statics.revokeAllSessions = function (userId) {
  return this.updateMany({ user: userId }, { isActive: false });
};

// Example of how to use these features together
loginSessionSchema.methods.useAndRotateToken = async function (
  newRefreshToken
) {
  this.isActive = true;
  this.refreshTokenUsed = true;
  this.refreshToken = newRefreshToken;
  this.lastActivity = Date.now();
  return this.save();
};

const LoginSession = mongoose.model("LoginSession", loginSessionSchema);

module.exports = LoginSession;
