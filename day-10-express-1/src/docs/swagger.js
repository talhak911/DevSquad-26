export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Task Manager API",
    version: "1.0.0",
    description: "In-Memory CRUD API for Managing Tasks",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Tasks",
      description: "Task management operations",
    },
    {
      name: "Stats",
      description: "Task statistics",
    },
  ],
  paths: {
    "/api/tasks": {
      get: {
        summary: "Get all tasks",
        tags: ["Tasks"],
        parameters: [
          {
            name: "title",
            in: "query",
            schema: { type: "string" },
            description: "Filter tasks by title",
          },
        ],
        responses: {
          200: {
            description: "Successful response",
          },
        },
      },
      post: {
        summary: "Add a new task",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Learn Express" },
                  completed: { type: "boolean", example: false },
                },
                required: ["title"],
              },
            },
          },
        },
        responses: {
          201: { description: "Task created successfully" },
          400: { description: "Bad request - Invalid input" },
        },
      },
    },
    "/api/tasks/{id}": {
      get: {
        summary: "Get a task by ID",
        tags: ["Tasks"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Successful response" },
          404: { description: "Task not found" },
        },
      },
      put: {
        summary: "Update a task",
        tags: ["Tasks"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Learn Express Advanced" },
                  completed: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Task updated successfully" },
          400: { description: "Bad request - Invalid input" },
          404: { description: "Task not found" },
        },
      },
      delete: {
        summary: "Remove a task",
        tags: ["Tasks"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Task removed successfully" },
          404: { description: "Task not found" },
        },
      },
    },
    "/api/stats": {
      get: {
        summary: "Get task stats",
        tags: ["Stats"],
        responses: {
          200: { description: "Stats retrieved successfully" },
        },
      },
    },
  },
};
