const express = require("express");
const {
  createClass,
  updateClass,
  deleteClass,
  getClass,
  assignExercise,
  getStudentProgress,
} = require("../controllers/class.controller");
const router = express.Router();

router.post("/", createClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.get("/:id", getClass);
router.post("/:id/exercises", assignExercise);
router.get("/:id/progress", getStudentProgress);

module.exports = router;
