import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';

const CATEGORIES = ['General', 'Work', 'Personal', 'Urgent', 'Shopping', 'Study'];
const PRIORITIES = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

export default function TodoFormModal({ isOpen, onClose, onSubmit, editingTodo }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    dueDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title || '',
        description: editingTodo.description || '',
        priority: editingTodo.priority || 'medium',
        category: editingTodo.category || 'General',
        dueDate: editingTodo.dueDate ? editingTodo.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'General',
        dueDate: '',
      });
    }
    setError('');
  }, [editingTodo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingTodo ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title input */}
          <div className="form-group">
            <label className="form-label" htmlFor="todo-title">Task Title *</label>
            <input
              id="todo-title"
              type="text"
              className="form-input"
              placeholder="e.g. Complete Full Stack presentation"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (error) setError('');
              }}
              autoFocus
            />
            {error && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{error}</span>}
          </div>

          {/* Description textarea */}
          <div className="form-group">
            <label className="form-label" htmlFor="todo-desc">Description</label>
            <textarea
              id="todo-desc"
              className="form-textarea"
              rows={3}
              placeholder="Add more details, links, or notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {/* Priority & Category */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="todo-priority">Priority</label>
              <select
                id="todo-priority"
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="todo-category">Category</label>
              <select
                id="todo-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="todo-duedate">Due Date (Optional)</label>
            <input
              id="todo-duedate"
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTodo ? (
                <>
                  <Save size={16} /> Save Changes
                </>
              ) : (
                <>
                  <Plus size={16} /> Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
