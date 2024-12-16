const UserProfile = require("../userProfile.model");

class UserProfileFunctions {
  async getUserProfile(userId, select = "", clean = false) {
    if (clean) {
      return await UserProfile.findOne({ user: userId }, select).lean();
    }
    return await UserProfile.findOne({ user: userId });
  }
}

module.exports = new UserProfileFunctions();
