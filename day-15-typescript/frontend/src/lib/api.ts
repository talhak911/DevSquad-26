import axios from 'axios';
import { z } from "zod";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  category: z.string().min(1, "Category is required").max(50),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const taskApi = {
  getTasks: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },
  createTask: async (title: string, category: string) => {
    const response = await api.post<Task>('/tasks', { title, category });
    return response.data;
  },
  updateTask: async (id: string, updates: Partial<Pick<Task, 'title' | 'completed' | 'category'>>) => {
    const response = await api.put<Task>(`/tasks/${id}`, updates);
    return response.data;
  },
  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};

export const categoryApi = {
  getCategories: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
  createCategory: async (name: string) => {
    const response = await api.post<Category>('/categories', { name });
    return response.data;
  },
  deleteCategory: async (name: string) => {
    await api.delete(`/categories/${name}`);
  },
};

export default api;
