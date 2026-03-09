import { v4 as uuidv4 } from "uuid";
import { tasks } from "../data/tasks.js";

// @desc    Get all tasks
// @route   GET /api/tasks
export const getTasks = (req, res, next) => {
  try {
    const { title } = req.query;
    let filteredTasks = tasks;

    if (title) {
      filteredTasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(title.toLowerCase()),
      );
    }

    res.status(200).json({
      success: true,
      data: filteredTasks,
      message: "Tasks retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a task by ID
// @route   GET /api/tasks/:id
export const getTaskById = (req, res, next) => {
  try {
    const task = tasks.find((t) => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
      message: "Task retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new task
// @route   POST /api/tasks
export const createTask = (req, res, next) => {
  try {
    const { title, completed } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Title is required and must be a string",
      });
    }

    let isCompleted = false;
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          success: false,
          data: null,
          message: "completed must be a boolean",
        });
      }
      isCompleted = completed;
    }

    const newTask = {
      id: uuidv4(),
      title,
      completed: isCompleted,
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask,
      message: "Task created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
export const updateTask = (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    if (title !== undefined && typeof title !== "string") {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Title must be a string",
      });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        data: null,
        message: "completed must be a boolean",
      });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...(title !== undefined && { title }),
      ...(completed !== undefined && { completed }),
    };

    tasks[taskIndex] = updatedTask;

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a task
// @route   DELETE /api/tasks/:id
export const deleteTask = (req, res, next) => {
  try {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    tasks.splice(taskIndex, 1);

    res.status(200).json({
      success: true,
      data: null,
      message: "Task removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task stats
// @route   GET /api/stats
export const getStats = (req, res, next) => {
  try {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
      },
      message: "Stats retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
