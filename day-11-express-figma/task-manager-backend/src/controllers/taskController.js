const Task = require("../models/Task");

/**
 * @desc   Get all tasks for the authenticated user
 * @route  GET /api/tasks
 * @access Private
 */
const getTasks = async (req, res, next) => {
  try {
    // Optional: filter by title query parameter
    const filter = { user: req.user._id };
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { tasks, count: tasks.length },
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get a single task by ID
 * @route  GET /api/tasks/:id
 * @access Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
      message: "Task fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new task
 * @route  POST /api/tasks
 * @access Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    const task = await Task.create({
      title,
      description,
      completed,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { task },
      message: "Task created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a task
 * @route  PUT /api/tasks/:id
 * @access Private
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, completed },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
      message: "Task updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a task
 * @route  DELETE /api/tasks/:id
 * @access Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: null,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get task statistics for the authenticated user
 * @route  GET /api/tasks/stats
 * @access Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    const [total, completed] = await Promise.all([
      Task.countDocuments({ user: req.user._id }),
      Task.countDocuments({ user: req.user._id, completed: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending: total - completed,
      },
      message: "Task statistics fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
