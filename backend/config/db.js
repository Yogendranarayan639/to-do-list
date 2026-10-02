const mongoose = require('mongoose');

let isConnected = false;
let dbSource = 'none';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_db';

  try {
    console.log(`📡 Attempting connection to MongoDB at: ${uri}`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    dbSource = 'MongoDB (Primary/Atlas)';
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed (${error.message}).`);
    console.log('🔄 Starting built-in Embedded MongoDB Server for instant development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      const conn = await mongoose.connect(memoryUri);
      isConnected = true;
      dbSource = 'Embedded MongoDB (In-Memory)';
      console.log(`✅ Embedded MongoDB Running: ${conn.connection.host}`);
      console.log('💡 Note: You can switch to your own MongoDB Atlas / Local instance anytime by updating MONGO_URI in backend/.env');
      await seedInitialData();
    } catch (memErr) {
      isConnected = false;
      dbSource = 'disconnected';
      console.error(`❌ Failed to start embedded MongoDB: ${memErr.message}`);
    }
  }
};

// Seed sample tasks if DB is empty
const seedInitialData = async () => {
  try {
    const Todo = require('../models/Todo');
    const count = await Todo.countDocuments();
    if (count === 0) {
      await Todo.create([
        {
          title: 'Complete Full-Stack To-Do App',
          description: 'Build React frontend and Express + MongoDB backend with complete CRUD functionality.',
          completed: true,
          priority: 'high',
          category: 'Work',
          dueDate: new Date(Date.now() + 86400000),
        },
        {
          title: 'Review MongoDB Schema and Indexes',
          description: 'Check fields for priority, categories, and full text search indexing.',
          completed: false,
          priority: 'medium',
          category: 'Study',
          dueDate: new Date(Date.now() + 172800000),
        },
        {
          title: 'Grocery Shopping for the Weekend',
          description: 'Buy fresh vegetables, fruits, almond milk, and whole wheat bread.',
          completed: false,
          priority: 'low',
          category: 'Shopping',
          dueDate: new Date(Date.now() + 259200000),
        },
      ]);
      console.log('🌱 Seeded 3 starter tasks for testing.');
    }
  } catch (seedErr) {
    console.warn('Seed notice:', seedErr.message);
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('⚠️ MongoDB Disconnected');
});

const isDBConnected = () => isConnected;
const getDBSource = () => dbSource;

module.exports = { connectDB, isDBConnected, getDBSource };
