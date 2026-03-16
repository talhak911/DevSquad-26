import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Title too long'),
  category: z.string().min(1, 'Category is required').max(50).default('Personal'),
});

export const updateTaskSchema = z.object({
  completed: z.boolean().optional(),
  title: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
});
