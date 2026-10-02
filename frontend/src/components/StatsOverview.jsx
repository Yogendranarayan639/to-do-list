import React from 'react';
import { ListTodo, CheckCircle2, Clock, Flame } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const total = stats.total || 0;
  const completed = stats.completed || 0;
  const pending = stats.pending || 0;
  const percent = stats.percent || 0;

  return (
    <section aria-label="Task Statistics">
      <div className="stats-grid">
        {/* Total Tasks */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <ListTodo size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{pending}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <Flame size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{percent}%</span>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
      </div>

      {/* Progress banner */}
      <div className="progress-banner">
        <div className="progress-header">
          <span>Completion Progress</span>
          <span>{completed} of {total} tasks completed ({percent}%)</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    </section>
  );
}
