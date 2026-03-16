import { Request, Response } from "express";
import { taskModel } from "../models/taskModel.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchema.js";

export const taskController = {
  getTasks: (req: Request, res: Response) => {
    const tasks = taskModel.getAll();
    res.json(tasks);
  },

  createTask: (req: Request, res: Response) => {
    const validation = createTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    const { title, category } = validation.data;
    const newTask = taskModel.add(title, category);
    res.status(201).json(newTask);
  },

  updateTask: (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = updateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    const updatedTask = taskModel.update(id as string, validation.data);
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  },

  deleteTask: (req: Request, res: Response) => {
    const { id } = req.params;
    const success = taskModel.delete(id as string);
    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).send();
  },
};
