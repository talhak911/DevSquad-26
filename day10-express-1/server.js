import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./src/docs/swagger.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve public directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Root Route - Redirect or Info
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Swagger Docs Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api", taskRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Only listen if not running in production/Vercel serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} - http://localhost:${PORT}`);
  });
}

// Export the app for Vercel
export default app;
