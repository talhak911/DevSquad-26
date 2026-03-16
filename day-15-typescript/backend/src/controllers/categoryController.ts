import { Request, Response } from "express";
import { categoryModel } from "../models/categoryModel.js";
import { tasks, taskModel } from "../models/taskModel.js";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
});

export const categoryController = {
  getCategories: (req: Request, res: Response) => {
    res.json(categoryModel.getAll());
  },

  createCategory: (req: Request, res: Response) => {
    const validation = createCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    const { name } = validation.data;
    const newCategory = categoryModel.add(name);

    if (!newCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    res.status(201).json(newCategory);
  },

  deleteCategory: (req: Request, res: Response) => {
    const name = req.params.name as string;
    const success = categoryModel.delete(name);

    if (!success) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Cascade delete: Remove all tasks associated with this category
    const tasksToDelete = tasks.filter(
      (t) => t.category.toLowerCase() === name.toLowerCase(),
    );
    tasksToDelete.forEach((t) => taskModel.delete(t.id));

    res.status(204).send();
  },
};
