import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./src/docs/swagger.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve public directory
app.use(express.static(path.join(process.cwd(), "public")));

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Root Route - Redirect or Info
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "home.html"));
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
