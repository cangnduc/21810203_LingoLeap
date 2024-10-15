const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const TestController = require("../controllers/test.controller");

router.post("/", authMiddleware(["admin", "user"]), TestController.addTest);

module.exports = router;
