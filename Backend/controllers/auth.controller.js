const User = require("../model/user.model");
const UserProfile = require("../model/userProfile.model");
const { BadRequestError } = require("../helpers/error");
const UserFunctions = require("../model/function/user.function");
const z = require("zod");
const { refreshTokenTime } = require("../constant/value");
const { wrapAsyncRoutes } = require("../helpers/asyncHandler");
const Response = require("../helpers/response");
const jwt = require("jsonwebtoken");
const LoginSessionFunctions = require("../model/function/loginSession.function");
const axios = require("axios");
// Define schemas
const { signupSchema, loginSchema } = require("../validator/auth.validator");
class AuthController {
  async signup(req, res) {
    const { username, email, password, role } = signupSchema.parse(req.body);
    const userFound = await User.findOne({ email });
    if (userFound) {
      throw new BadRequestError("User already exists");
    }
    const { user, userProfile } = await UserFunctions.createUser(
      { username, email, password, role },
      {}
    );
    const { accessToken, refreshToken } = await UserFunctions.generateToken(
      user
    );
    // await LoginSessionFunctions.createLoginSession({
    //   user,
    //   refreshToken,
    //   clientId: req.clientId,
    //   deviceInfo: req.deviceInfo.device,
    //   ipAddress: req.ipAddress,
    // });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    Response.sendSuccess(
      res,
      "User logged in successfully",
      {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          userProfile: userProfile._id.toString(),
        },
        accessToken,
      },
      201
    );
  }

  async login(req, res) {
    const { email, password } = loginSchema.parse(req.body);
    const user = await UserFunctions.loginUser(email, password);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const { accessToken, refreshToken } = await UserFunctions.generateToken(
      user
    );
    // const loginSession = await LoginSessionFunctions.createLoginSession({
    //   user,
    //   refreshToken,
    //   clientId: req.clientId,
    //   deviceInfo: req.deviceInfo.device,
    //   ipAddress: req.ipAddress,
    // });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    Response.sendSuccess(res, "User logged in successfully", {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        userProfile: user.userProfile,
      },
      accessToken,
    });
  }

  async refreshToken(req, res) {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      throw new BadRequestError("Refresh token not found");
    }
    const { decoded, error } = await new Promise((resolve) => {
      jwt.verify(oldRefreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          resolve({ error: err });
        } else {
          resolve({ decoded, error: null });
        }
      });
    });

    if (error) {
      throw new BadRequestError("Invalid refresh token");
    }

    const user = await UserFunctions.getUserById(decoded.id, true);

    const { accessToken, refreshToken } = await UserFunctions.generateToken(
      user
    );

    // const result = await LoginSessionFunctions.updateRefreshToken(
    //   user._id,
    //   refreshToken,
    //   oldRefreshToken,
    //   req.clientId
    // );

    if (!result.success) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
      });
      throw new BadRequestError(result.error);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: refreshTokenTime, // 7 days
    });

    Response.sendSuccess(res, "Get new access token successfully", accessToken);
  }

  async logout(req, res) {
    const userId = req.user._id;
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken", refreshToken);
    if (!userId || !refreshToken) {
      throw new BadRequestError("User not logged in");
    }
    // const deleted = await LoginSessionFunctions.deleteLoginSession(
    //   userId,
    //   refreshToken
    // );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });
    Response.sendSuccess(res, "User logged out successfully");
  }

  async googleAuth(req, res, next) {
    const token = req.body.token;
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
    );
    const { email, name, picture } = response.data;
    const user = await User.findOne({ email });
    if (!user) {
      const { user, userProfile } = await UserFunctions.createUser(
        {
          username: name,
          email,
          password: "",
          role: "user",
          avatar: picture,
          loginMethod: "google",
        },
        {}
      );
    }

    const { accessToken, refreshToken } = await UserFunctions.generateToken(
      user
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    Response.sendSuccess(res, "User logged in successfully", {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        userProfile: user.userProfile,
      },
      accessToken,
    });
  }

  async googleAuthCallback(req, res, next) {
    // Implementation
  }

  async verifyEmail(req, res) {
    // Implementation
  }

  async forgotPassword(req, res) {
    // Implementation
  }

  async resetPassword(req, res) {
    // Implementation
  }
}

module.exports = wrapAsyncRoutes(new AuthController());
