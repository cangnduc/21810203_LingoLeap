const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongooseClient = require("./config/mongoose.db");
const Response = require("./helpers/response");
const https = require("https");
const clientInfoMiddleware = require("./middleware/clientInfo.middleware");
const seedDummyData = require("./model/seed/question.seed");
//zip the response
const compression = require("compression");
const swagger = require("./docs/swagger/index");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const sslOptions = {
  key: fs.readFileSync("../localhost+1-key.pem"),
  cert: fs.readFileSync("../localhost+1.pem"),
};
const {
  Question,
  ReadingPassage,
  ListeningPassage,
} = require("./model/question.model");
const app = express();
const {
  AppError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
  ForbiddenError,
} = require("./helpers/error");
const { ZodError } = require("zod");

const allowedOrigins = [
  "http://localhost:5173",
  "https://localhost:5173",
  "http://192.168.1.6:5173",
  "https://192.168.1.6:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
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

// Enable pre-flight requests for all routes
app.options("*", cors());

// JSON parsing error handler

//connect to database
mongooseClient.connect();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
//app.use(upload.any());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(clientInfoMiddleware);
//app.use(compression());
//routes
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.get("/seed", (req, res) => {
  seedDummyData();
  res.status(200).json({ message: "Seeded" });
});

app.use("/api/v1", require("./routes/index.route"));
const PORT = process.env.PORT || 3000;
// Swagger setup
swagger(app, PORT);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.errors,
    });
  }
  if (err instanceof BadRequestError) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.message,
    });
  }
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.message,
    });
  }
  if (!(err instanceof AppError)) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      code: 500,
      errors: err.message,
    });
  }
  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      code: 403,
      errors: err.message,
    });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      code: 401,
      errors: err.message,
    });
  }
  if (err instanceof MongoServerError) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      code: 400,
      errors: err.message,
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    code: err.statusCode,
    errors: err.errors,
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  const notFoundError = new NotFoundError("This route is not defined");
  Response.sendError(res, notFoundError);
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
