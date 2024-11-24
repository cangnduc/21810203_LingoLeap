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
const handleError = require("./middleware/error.middleware");
const ip = 9;
const sslOptions = {
  key: fs.readFileSync(`../localhost+${ip}-key.pem`),
  cert: fs.readFileSync(`../localhost+${ip}.pem`),
};

const app = express();
const { NotFoundError } = require("./helpers/error");

const allowedOrigins = [
  "http://localhost:5173",
  "https://localhost:5173",
  `http://192.168.1.${7}:5173`,
  `https://192.168.1.${7}:5173`,
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
app.use(handleError);

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
