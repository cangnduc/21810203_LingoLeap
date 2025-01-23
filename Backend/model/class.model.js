const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Class teacher is required"],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
