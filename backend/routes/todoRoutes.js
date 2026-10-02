const express = require('express');
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
} = require('../controllers/todoController');

// Bulk action
router.delete('/completed/clear', clearCompleted);

// CRUD routes
router.route('/')
  .get(getTodos)
  .post(createTodo);

router.route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

// Quick toggle
router.patch('/:id/toggle', toggleTodo);

module.exports = router;
