const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { logEvent, cleanup, watchFiles } = require("./helpers/filechange");
const cookieParser = require("cookie-parser");
const mongooseClient = require("./config/mongoose.db");
const Response = require("./helpers/response");
const https = require("https");
const clientInfoMiddleware = require("./middleware/clientInfo.middleware");
const compression = require("compression");
const swagger = require("./docs/swagger/index");
const handleError = require("./middleware/error.middleware");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const ip = 10; //ip of the local machine, find it in the ipconfig command
const sslOptions = {
  key: fs.readFileSync(`../localhost+${ip}-key.pem`),
  cert: fs.readFileSync(`../localhost+${ip}.pem`),
};
const app = express();
const { NotFoundError } = require("./helpers/error");

const allowedOrigins = [
  "http://localhost:5173",
  "https://localhost:5173",
  "http://localhost:3000",
  "https://localhost:3000",
  `http://192.168.1.${ip}:5173`,
  `https://192.168.1.${ip}:5173`,
  //"https://62e8-2402-800-6343-af40-3c6a-6ede-4595-c0ab.ngrok-free.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.includes("ngrok")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
);

app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(clientInfoMiddleware);
app.use(compression());
// Routes
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/dist", "index.html")); // Serve index.html
// });

app.use("/api/v1", require("./routes/index.route"));

// Swagger setup
swagger(app, PORT);

// Error handling middleware
app.use(handleError);

// 404 handler for undefined routes
app.use((req, res, next) => {
  const notFoundError = new NotFoundError("This route is not defined");
  Response.sendError(res, notFoundError);
});

const gracefulShutdown = async (server) => {
  console.log(new Date().toISOString() + ": Server shutting down...");

  try {
    // Close server first
    await new Promise((resolve) => {
      server.close(() => {
        console.log("HTTP server closed");
        resolve();
      });
    });

    // Close file watcher if exists
    const watcher = app.get("fileWatcher");
    if (watcher) {
      watcher.close();
      console.log("File watcher closed");
    }

    // Close database connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("Database connection closed");
    }

    cleanup();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

// Keep server reference
let server;

const startServer = async () => {
  try {
    // Connect to database first
    await mongooseClient.connect();

    // Create HTTPS server only after successful database connection
    server = https.createServer(sslOptions, app).listen(PORT, () => {
      logEvent(`Server running on port ${PORT}`);

      // Start file watching
      const watcher = watchFiles();
      app.set("fileWatcher", watcher);
    });

    // Handle server shutdown
    process.on("SIGTERM", () => gracefulShutdown(server));
    process.on("SIGINT", () => gracefulShutdown(server));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
