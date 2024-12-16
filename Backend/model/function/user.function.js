const User = require("../user.model");
const UserProfile = require("../userProfile.model");
const { NotFoundError, UnauthorizedError } = require("../../helpers/error");
const { accessTokenTime, refreshTokenTime } = require("../../constant/value");
const jwt = require("jsonwebtoken");
class UserFunctions {
  // Get a user by id
  async getUserById(id, select = "", clean = false) {
    if (clean) {
      return await User.findById(id, select).lean();
    }
    return await User.findById(id);
  }

  async getProfileByUserId(id, select = "", clean = false) {
    if (clean) {
      return await UserProfile.findById(id, select).lean();
    }
    return await UserProfile.findById(id);
  }

  //get full user
  async getFullUser(id, userOptions = "", profileOptions = "", clean = false) {
    const query = User.findById(id, userOptions).populate(
      "userProfile",
      profileOptions
    );
    if (clean) {
      return await query.lean();
    }
    return await query;
  }
  // Get a user by email

  async loginUser(email, password) {
    const user = await User.findOne({ email }).populate("userProfile");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid password");
    }
    return user;
  }
  async logoutUser(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }
  async generateToken(user) {
    try {
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: accessTokenTime,
      });
      const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: refreshTokenTime,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error generating tokens:", error);
      throw error;
    }
  }

  // Create a new user
  async createUser(userData, profileData) {
    const newUser = new User(userData);

    const newUserProfile = new UserProfile({
      user: newUser._id,
      ...profileData,
    });
    await newUser.save();
    await newUserProfile.save();

    return { user: newUser, userProfile: newUserProfile };
  }

  // Update user information
  async updateUser(id, updateData, profileUpdateData) {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    const updatedUserProfile = await UserProfile.findOneAndUpdate(
      { user: id },
      profileUpdateData,
      { new: true }
    );
    return { user: updatedUser, userProfile: updatedUserProfile };
  }

  // Delete a user (soft delete)
  async deleteUser(id) {
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    return deletedUser;
  }

  // Verify user's email
  async verifyUserEmail(id) {
    return await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
  }

  // Change user's password
  async changeUserPassword(id, newPassword) {
    const user = await User.findById(id);
    user.password = newPassword;
    await user.save();
    return user;
  }

  // Get all users (with pagination)
  async getAllUsers(page = 1, limit = 10) {
    const users = await User.find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit);

    const userIds = users.map((user) => user._id);
    const userProfiles = await UserProfile.find({ user: { $in: userIds } });

    return users.map((user) => {
      const profile = userProfiles.find(
        (profile) => profile.user.toString() === user._id.toString()
      );
      return { user, userProfile: profile };
    });
  }

  // Add a new method to update user profile
  async updateUserProfile(userId, profileData) {
    return await UserProfile.findOneAndUpdate({ user: userId }, profileData, {
      new: true,
    });
  }
}

module.exports = new UserFunctions();
