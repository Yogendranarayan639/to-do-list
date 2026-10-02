import React from 'react';
import { Check, Edit3, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const formattedDate = formatDate(todo.dueDate);

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* Checkbox Toggle Button */}
      <button
        className={`checkbox-btn ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo._id)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as completed'}
        title={todo.completed ? 'Mark as incomplete' : 'Mark as completed'}
      >
        {todo.completed && <Check size={16} strokeWidth={3} />}
      </button>

      {/* Main Task Content */}
      <div className="todo-content">
        <h2 className="todo-title">{todo.title}</h2>
        {todo.description && <p className="todo-desc">{todo.description}</p>}

        {/* Metadata Badges */}
        <div className="todo-meta">
          {/* Priority Badge */}
          <span className={`badge badge-${todo.priority || 'medium'}`}>
            <AlertCircle size={10} />
            {todo.priority || 'medium'}
          </span>

          {/* Category Badge */}
          {todo.category && (
            <span className="badge badge-category">
              <Tag size={10} />
              {todo.category}
            </span>
          )}

          {/* Due Date Badge */}
          {formattedDate && (
            <span className="badge badge-date">
              <Calendar size={10} />
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      {/* Actions (Edit / Delete) */}
      <div className="todo-actions">
        <button
          className="action-icon-btn btn-edit"
          onClick={() => onEdit(todo)}
          aria-label="Edit task"
          title="Edit task"
        >
          <Edit3 size={16} />
        </button>
        <button
          className="action-icon-btn btn-delete"
          onClick={() => onDelete(todo._id, todo.title)}
          aria-label="Delete task"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
