const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Course title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: [500, "Course description cannot exceed 500 characters"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor reference is required"],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lessons: [
      {
        title: {
          type: String,
          required: [true, "Lesson title is required"],
          trim: true,
          maxlength: [100, "Lesson title cannot exceed 100 characters"],
        },
        content: {
          type: String,
          required: [true, "Lesson content is required"],
        },
        resources: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: [true, "Course level is required"],
    },
    duration: {
      type: Number,
      required: [true, "Course duration is required"],
      min: [1, "Course duration must be at least 1 hour"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing
courseSchema.index({ title: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ isPublished: 1 });

// Methods
courseSchema.methods.enroll = function (studentId) {
  if (!this.students.includes(studentId)) {
    this.students.push(studentId);
  }
  return this.save();
};

courseSchema.methods.unenroll = function (studentId) {
  this.students = this.students.filter((id) => !id.equals(studentId));
  return this.save();
};

// Virtuals
courseSchema.virtual("studentCount").get(function () {
  return this.students.length;
});

courseSchema.virtual("lessonCount").get(function () {
  return this.lessons.length;
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
