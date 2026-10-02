import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { api } from './services/api';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import TodoFilter from './components/TodoFilter';
import TodoItem from './components/TodoItem';
import TodoFormModal from './components/TodoFormModal';
import Toast from './components/Toast';
import { Plus, CheckSquare } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percent: 0 });
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('taskflow_theme') || 'dark');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Search and Filter criteria
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Show toast notification
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Health and DB connection check
  const checkBackendHealth = useCallback(async () => {
    try {
      const data = await api.checkHealth();
      const connected = Boolean(data?.database?.connected);
      setDbConnected(connected);
      if (!connected && data.status === 'online') {
        addToast('MongoDB is disconnected. Please check MONGO_URI in backend/.env', 'error');
      }
    } catch {
      setDbConnected(false);
    }
  }, []);

  // Fetch todos with current filters
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getTodos(filters);
      if (res.success) {
        setTodos(res.data);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
      addToast(err.message || 'Could not connect to backend server', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Filter change handler
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Create or Update submit
  const handleFormSubmit = async (formData) => {
    try {
      if (editingTodo) {
        // Update
        const res = await api.updateTodo(editingTodo._id, formData);
        if (res.success) {
          addToast('Task updated successfully!', 'success');
          setIsModalOpen(false);
          setEditingTodo(null);
          loadTodos();
        }
      } else {
        // Create
        const res = await api.createTodo(formData);
        if (res.success) {
          addToast('New task added successfully!', 'success');
          setIsModalOpen(false);
          loadTodos();
        }
      }
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  // Toggle completion status
  const handleToggle = async (id) => {
    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );

      const res = await api.toggleTodo(id);
      if (res.success) {
        addToast(res.message, 'success');
        loadTodos();
      }
    } catch (err) {
      addToast(err.message || 'Failed to toggle status', 'error');
      loadTodos();
    }
  };

  // Open edit modal
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // Delete single todo
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      // Optimistic delete
      setTodos((prev) => prev.filter((t) => t._id !== id));
      const res = await api.deleteTodo(id);
      if (res.success) {
        addToast('Task deleted', 'info');
        loadTodos();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
      loadTodos();
    }
  };

  // Clear completed todos
  const handleClearCompleted = async () => {
    if (!window.confirm(`Delete all ${stats.completed} completed tasks?`)) {
      return;
    }

    try {
      const res = await api.clearCompleted();
      if (res.success) {
        addToast(res.message, 'info');
        loadTodos();
      }
    } catch (err) {
      addToast(err.message || 'Failed to clear completed tasks', 'error');
    }
  };

  return (
    <div className="app-wrapper">
      {/* Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        dbConnected={dbConnected}
      />

      <main className="main-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-text">
            <h1>Stay Focused, Get Things Done.</h1>
            <p>Manage, prioritize, and track your daily tasks effortlessly.</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add New Task</span>
          </button>
        </section>

        {/* Task Metrics & Progress */}
        <StatsOverview stats={stats} />

        {/* Filter & Search Bar */}
        <TodoFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          completedCount={stats.completed}
          onClearCompleted={handleClearCompleted}
        />

        {/* Task List / Skeletons / Empty State */}
        <section aria-label="Task List" style={{ marginTop: '1.5rem' }}>
          {loading ? (
            <div className="todo-list">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          ) : todos.length > 0 ? (
            <div className="todo-list">
              {todos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <CheckSquare size={32} />
              </div>
              <h3 className="empty-title">No tasks found</h3>
              <p className="empty-desc">
                {filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all'
                  ? 'No tasks match your current search or filter criteria.'
                  : 'You have no tasks yet! Click "Add New Task" to create your first one.'}
              </p>
              {!(filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all') && (
                <button
                  className="btn-primary"
                  style={{ marginTop: '1.25rem' }}
                  onClick={() => {
                    setEditingTodo(null);
                    setIsModalOpen(true);
                  }}
                >
                  <Plus size={18} />
                  <span>Create Your First Task</span>
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Add / Edit Task Modal */}
      <TodoFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleFormSubmit}
        editingTodo={editingTodo}
      />

      {/* Toast Alerts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
