const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/signup", AuthController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid input
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/logout",
  authMiddleware(["admin", "teacher", "user"]),
  AuthController.logout
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh a user's token
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/refresh", AuthController.refreshToken);
//router.get("/google", AuthController.googleAuth);
//router.get("/google/callback", AuthController.googleAuthCallback);
router.post(
  "/tests",
  authMiddleware(["admin", "user"]),
  asyncHandler(async (req, res) => {
    const user = req.user;
    const refreshToken = req.cookies.refreshToken;

    console.log("refreshToken", refreshToken);
    res.json({
      message: "Hello",
      data: {
        user,
        refreshToken,
      },
    });
  })
);
router.post("/google", AuthController.googleAuth);
module.exports = router;
