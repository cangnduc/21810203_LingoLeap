import express from "express";
import { AccessToken } from "livekit-server-sdk";
import { authMiddleware } from "../middleware/auth.middleware.js";
import Response from "../helpers/response.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware(["admin", "teacher", "user"]),
  async (req, res) => {
    const user = req.user || "anonymous-user";
    const { question, duration, testAttemptId } = req.body;
    console.log("user", user);
    const durationInSeconds = duration * 60;

    const roomid = Math.floor(Math.random() * 1000000);
    const roomName = `Exam Room ${roomid}`;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res
        .status(500)
        .json({ error: "LiveKit API key or secret is not set" });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.username || "anonymous-user",
      ttl: (durationInSeconds + 30) * 1000,
      metadata: JSON.stringify({
        question,
        duration,
        testAttemptId,
      }),
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
      roomDuration: durationInSeconds * 1000,
    });

    try {
      const token = await at.toJwt();
      Response.sendSuccess(res, "Voice generated successfully", {
        token: token,
        url: process.env.LIVEKIT_URL,
        expiresIn: durationInSeconds + 30,
      });
    } catch (error) {
      console.error("Error generating token:", error);
      res.status(500).json({ error: "Failed to generate token" });
    }
  }
);

export default router;
