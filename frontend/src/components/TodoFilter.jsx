import React from 'react';
import { Search, Trash2, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'General', 'Work', 'Personal', 'Urgent', 'Shopping', 'Study'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

export default function TodoFilter({
  filters,
  onFilterChange,
  completedCount,
  onClearCompleted,
}) {
  return (
    <section className="controls-bar" aria-label="Filters and Search">
      {/* Search Input */}
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or description..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      {/* Filter Row: Status Tabs & Dropdowns */}
      <div className="filter-row">
        {/* Status Tabs */}
        <div className="status-tabs" role="tablist">
          {['all', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={filters.status === tab}
              className={`tab-btn ${filters.status === tab ? 'active' : ''}`}
              onClick={() => onFilterChange('status', tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dropdowns for Priority & Category */}
        <div className="filter-dropdowns">
          <select
            className="select-control"
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            aria-label="Filter by priority"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p.toLowerCase()}>
                Priority: {p}
              </option>
            ))}
          </select>

          <select
            className="select-control"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c === 'All' ? 'all' : c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Clear Completed Tasks Button */}
          {completedCount > 0 && (
            <button
              className="btn-clear-completed"
              onClick={onClearCompleted}
              title="Delete all completed tasks"
            >
              <Trash2 size={14} />
              <span>Clear Done ({completedCount})</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
