const LoginSession = require("../loginSession.model");
const { BadRequestError } = require("../../helpers/error");
class LoginSessionFunctions {
  static async createLoginSession({
    user,
    refreshToken,
    clientId,
    deviceInfo,
    ipAddress,
  }) {
    const newLoginSession = new LoginSession({
      user: user._id,
      refreshToken,
      clientId,
      deviceInfo,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    console.log("Login session created");
    return await newLoginSession.save();
  }

  static async deleteLoginSession(userId, refreshToken) {
    const loginSessionFound = await LoginSession.findOne({
      user: userId,

      refreshToken,
    });
    if (!loginSessionFound) {
      console.log("Login session not found");
      throw new BadRequestError("Login session not found");
    }
    await LoginSession.deleteOne({ _id: loginSessionFound._id });
    console.log("Login session deleted");

    return true;
  }

  static async updateRefreshToken(
    userId,
    newrefreshToken,
    oldrefreshToken,
    clientId
  ) {
    const loginSessionFound = await LoginSession.findOne({
      user: userId,
      refreshToken: oldrefreshToken,
      clientId,
    });
    if (!loginSessionFound) {
      return {
        success: false,
        error: "Login session not found, token is stolen",
      };
    }

    loginSessionFound.refreshToken = newrefreshToken;
    loginSessionFound.expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 7 days from now

    await loginSessionFound.save();

    console.log("Login session updated");

    return { success: true, loginSession: loginSessionFound };
  }
  static async revokeAllSessions(userId) {
    await LoginSession.revokeAllSessions(userId);
  }

  // ... other methods ...
}

module.exports = LoginSessionFunctions;
