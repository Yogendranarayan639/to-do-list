require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, isDBConnected, getDBSource } = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins for dev flexibility
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Lightweight)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = isDBConnected();
  res.status(200).json({
    status: 'online',
    message: 'To-Do List API is operational',
    database: {
      connected: dbStatus,
      engine: getDBSource(),
      status: dbStatus ? 'Connected' : 'Connecting/Disconnected (Check MongoDB service or URI in .env)',
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/todos', todoRoutes);

// Root route
app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Full-Stack To-Do List REST API',
    endpoints: {
      health: 'GET /api/health',
      todos: 'GET /api/todos',
      create: 'POST /api/todos',
      update: 'PUT /api/todos/:id',
      toggle: 'PATCH /api/todos/:id/toggle',
      delete: 'DELETE /api/todos/:id',
    },
  });
});

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 To-Do Backend Server is running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
