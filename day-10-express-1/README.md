# Task Manager API

An In-Memory CRUD API built with Node.js and Express.js for managing tasks.
It uses no external database and restarts from scratch on server load.

## Features

- **In-Memory Storage**: Create, read, update, and delete tasks fast without setting up a db.
- **API Documentation**: Detailed interactive Swagger UI available out-of-the-box.
- **Stats Endpoint**: Track total, completed, and pending tasks.
- **Search capabilities**: Check the GET /api/tasks endpoint and add `?title=value` query parameter.

## Prerequisites

- Node.js installed

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run in development mode** (auto-reloads on edits):
   ```bash
   npm run dev
   ```
3. **Run normally**:
   ```bash
   npm start
   ```

## Documentation

Once the server is running, navigate your browser to:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Sample Request / Response

**Add a new task (POST /api/tasks)**
Request:

```json
{
  "title": "Learn Express",
  "completed": false
}
```

Response (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "e6dc3ecb-bb2a-43eb-b8bb-6fece9cf1ca0",
    "title": "Learn Express",
    "completed": false
  },
  "message": "Task created successfully"
}
```

## Tools

- **Express.js** as the main web framework.
- **Swagger / swagger-ui-express** for API documentation.
- **UUID** for creating unique identifiers.
- **nodemon** for local iteration.
