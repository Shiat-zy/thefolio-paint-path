// backend/server.js
require('dotenv').config(); // Load environment variables FIRST
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
connectDB(); // Connect to MongoDB

// CORS - allow both localhost and your live Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://paint-path.vercel.app'   // replace with your actual Vercel URL if different
  ],
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded image files as public URLs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is alive' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});