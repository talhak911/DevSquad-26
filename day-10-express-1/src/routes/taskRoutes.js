import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStats,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/stats", getStats);

router.route("/tasks").get(getTasks).post(createTask);

router.route("/tasks/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
