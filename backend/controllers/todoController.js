const Todo = require('../models/Todo');
const { isDBConnected } = require('../config/db');

// @desc    Get all todos (with filtering, search, and sorting)
// @route   GET /api/todos
const getTodos = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    // Status filter
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'active') {
      query.completed = false;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority.toLowerCase();
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search filter
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const todos = await Todo.find(query).sort(sortOptions);

    // Summary counts for stats
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ completed: true });
    const pending = total - completed;

    res.status(200).json({
      success: true,
      count: todos.length,
      stats: {
        total,
        completed,
        pending,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100),
      },
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message,
    });
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving task',
      error: error.message,
    });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority ? priority.toLowerCase() : 'medium',
      category: category || 'General',
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: todo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create task',
    });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
const updateTodo = async (req, res) => {
  try {
    const { title, description, completed, priority, category, dueDate } = req.body;

    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority.toLowerCase();
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = dueDate || null;

    todo = await Todo.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: todo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update task',
    });
  }
};

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${todo.completed ? 'completed' : 'pending'}`,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle task status',
      error: error.message,
    });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message,
    });
  }
};

// @desc    Clear all completed todos
// @route   DELETE /api/todos/completed/clear
const clearCompleted = async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });

    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} completed task(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear completed tasks',
      error: error.message,
    });
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
};
