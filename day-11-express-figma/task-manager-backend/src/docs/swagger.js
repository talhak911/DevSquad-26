const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "2.0.0",
      description:
        "A production-ready REST API for managing tasks with JWT authentication, MongoDB persistence, and request validation.",
      contact: {
        name: "Task Manager API",
      },
    },
    // servers array is omitted so Swagger UI will automatically use the current host (works for both localhost and Vercel)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token (obtained from /api/users/login or /api/users/register)",
        },
      },
      schemas: {
        Task: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d5ec49f1b2c8a3d4e5f6g7" },
            title: { type: "string", example: "Learn Express.js" },
            description: {
              type: "string",
              example: "Study Express routing and middleware",
            },
            completed: { type: "boolean", example: false },
            user: { type: "string", example: "60d5ec49f1b2c8a3d4e5f6g0" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        TaskResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                task: { $ref: "#/components/schemas/Task" },
              },
            },
            message: { type: "string", example: "Task fetched successfully" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", example: "john@example.com" },
                    createdAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
            message: { type: "string", example: "Logged in successfully" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            data: { type: "null", example: null },
            message: { type: "string", example: "An error occurred" },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            data: { type: "null", example: null },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: {
                    type: "string",
                    example: "Please provide a valid email",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")], // Safe absolute path for Vercel
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
