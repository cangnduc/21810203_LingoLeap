const mongoose = require("mongoose");
const baseSchema = require("./base.model");

const exerciseSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Exercise content is required"],
    },
  },
  {
    timestamps: true,
  }
);

const BaseModel = mongoose.model("Base", baseSchema);
const Exercise = BaseModel.discriminator("Exercise", exerciseSchema);

module.exports = Exercise;
