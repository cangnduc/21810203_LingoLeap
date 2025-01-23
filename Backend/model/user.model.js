const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,

      //only required if loginMethod is email
      required: function () {
        return this.loginMethod === "email";
      },
    },
    dateOfBirth: {
      type: Date,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,

      country: String,
    },
    loginMethod: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    avatar: {
      type: String,
      default: undefined,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "teacher", "admin"],
      default: "user",
    },
    userProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    userStatistics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserStatistics",
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
