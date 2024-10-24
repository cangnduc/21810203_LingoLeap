const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const questionExamples = require("./examples/questionExamples");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the application",
    },
    servers: [
      {
        url: "https://localhost:3000/api/v1",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Question: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier for a question",
            },
            section: {
              type: "string",
              enum: ["reading", "listening", "speaking", "writing", "general"],
              description: "The section of the question",
            },
            type: {
              type: "string",
              enum: [
                "single_choice",
                "multiple_choice",
                "fill_in_the_blank",
                "matching",
                "true_false",
                "open_ended",
                "essay",
              ],
              description: "The type of the question",
            },
            questionText: {
              type: "string",
              description: "The text of the question",
            },
            instruction: {
              type: "string",
              description: "The instruction for the question",
            },
            correctAnswer: {
              type: "string",
              description:
                "The correct answer for single choice, true/false, or fill in the blank questions",
            },
            correctAnswers: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The correct answers for multiple choice questions",
            },
            answers: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The possible answers for the question",
            },
            difficulty: {
              type: "integer",
              description: "The difficulty level of the question",
            },
            createdBy: {
              type: "string",
              description: "The ID of the user who created the question",
            },
            readingPassage: {
              type: "string",
              description: "The ID of the associated reading passage",
            },
            prompt: {
              type: "string",
              description: "The prompt for speaking or writing questions",
            },
            listeningPassage: {
              type: "string",
              description: "The ID of the associated listening passage",
            },
          },
        },
        listeningSection: {

        },
        createQuestionRequest: {
          type: "object",
          properties: {
            section: {
              type: "string",
              enum: ["reading", "listening", "speaking", "writing", "general"],
              description: "The section of the question",
            },
            title: {
              type: "string",
              description: "The title of the question",
              required: ["reading", "listening"],
            },
            text: {
              type: "string",
              description: "The text of the question",
              required: ["reading", "listening"],
            },
            url: {
              type: "string",
              description: "The URL of the question",
              required: ["reading", "listening"],
            },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "single_choice",
                      "multiple_choice",
                      "fill_in_the_blank",
                      "matching",
                      "true_false",
                      "open_ended",
                      "essay",
                    ],
                  },
                  questionText: {
                    type: "string",
                    description: "The text of the question",
                  },
                  instruction: {
                    type: "string",
                    description: "The instruction for the question",
                  },
                  correctAnswer: {
                    type: "string",
                    description:
                      "The correct answer for single choice, true/false, or fill in the blank questions",
                    required: [
                      "single_choice",
                      "true_false",
                      "fill_in_the_blank",
                    ],
                  },
                  correctAnswers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The correct answers for multiple choice questions",
                    minItems: 2,
                    maxItems: 4,

                    required: ["multiple_choice"],
                  },
                  answers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "The possible answers for the question. 3-5",
                    required: [
                      "single_choice",
                      "multiple_choice",
                      "fill_in_the_blank",
                    ],
                  },
                  difficulty: {
                    type: "integer",
                    description: "The difficulty level of the question. 1-5",
                  },
                  prompt: {
                    type: "string",
                    description: "The prompt for speaking or writing questions",
                    required: ["speaking", "writing"],
                  },
                  soundFile: {
                    type: "string",
                    format: "binary",
                    description: "Audio file for listening questions",
                  },
                },
                required: ["type", "questionText", "difficulty"],
              },
            },
          },
          required: ["section", "questions"],
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier for a user",
            },
            email: {
              type: "string",
              description: "The email of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            password: {
              type: "string",
              description: "The password of the user",
            },
            isVerified: {
              type: "boolean",
              description: "Whether the user's email is verified",
            },
            isDeleted: {
              type: "boolean",
              description: "Whether the user is deleted",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "teacher"],
              description: "The role of the user",
            },
            userProfile: {
              type: "string",
              description: "The ID of the associated user profile",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time when the user was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date and time when the user was last updated",
            },
          },
          required: ["email", "username", "password", "role"],
        },
        SignupRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "The email of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            password: {
              type: "string",
              description: "The password of the user",
            },
            role: {
              type: "string",
              enum: ["user", "teacher"],
              description: "The role of the user",
            },
          },
          required: ["email", "username", "password", "role"],
        },

        LoginRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "The email of the user",
            },
            password: {
              type: "string",
            },
          },
        },
      },
      examples: questionExamples,
    },
  },
  apis: ["./routes/*.js", "./models/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);

module.exports = (app, port) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger is running on https://localhost:${port}/api-docs`);
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
