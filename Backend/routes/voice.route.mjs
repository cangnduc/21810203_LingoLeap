import express from "express";
import { AccessToken } from "livekit-server-sdk";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.get(
  "/",
  authMiddleware(["admin", "user"]),
  asyncHandler(async (req, res) => {
    // Ensure user identity is provided
    const user = req.user || "anonymous-user";
    console.log("User:", user);
    const roomid = Math.floor(Math.random() * 1000000);
    const roomName = `Exam Room ${roomid}`;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    console.log("API Key:", apiKey);
    console.log("url:", process.env.LIVEKIT_URL);
    console.log("API Secret:", apiSecret);
    if (!apiKey || !apiSecret) {
      return res
        .status(500)
        .json({ error: "LiveKit API key or secret is not set" });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.username || "anonymous-user",
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });
    try {
      const token = await at.toJwt();
      console.log("Generated token:", token);
      //res.set("Cache-Control", "public, max-age=300"); // Cache for 5 minutes
      res.json({
        token: token,
        url: process.env.LIVEKIT_URL,
      });
    } catch (error) {
      console.error("Error generating token:", error);
      res.status(500).json({ error: "Failed to generate token" });
    }
  })
);

export default router;
