import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./src/docs/swagger.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Root Route - Redirect or Info
app.get("/", (req, res) => {
  res.send(
    `<h1>Task Manager API</h1><p>Visit <a href="/api-docs">/api-docs</a> for Swagger documentation.</p>`,
  );
});

// Swagger Docs Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api", taskRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} - http://localhost:${PORT}`);
});
