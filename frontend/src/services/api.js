const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

export const api = {
  // Check backend & MongoDB status
  async checkHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return await handleResponse(res);
    } catch (err) {
      return { status: 'offline', error: err.message, database: { connected: false } };
    }
  },

  // Fetch all tasks with optional filters
  async getTodos(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${BASE_URL}/todos${queryString}`);
    return await handleResponse(res);
  },

  // Fetch single task
  async getTodo(id) {
    const res = await fetch(`${BASE_URL}/todos/${id}`);
    return await handleResponse(res);
  },

  // Create new task
  async createTodo(todoData) {
    const res = await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    return await handleResponse(res);
  },

  // Update task details
  async updateTodo(id, updateData) {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    return await handleResponse(res);
  },

  // Toggle completion status
  async toggleTodo(id) {
    const res = await fetch(`${BASE_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    return await handleResponse(res);
  },

  // Delete task
  async deleteTodo(id) {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  },

  // Clear all completed tasks
  async clearCompleted() {
    const res = await fetch(`${BASE_URL}/todos/completed/clear`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  },
};
