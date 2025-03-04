const express = require('express');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// User routes
router.use('/users', userRoutes);

// Chat routes
router.use('/chat', chatRoutes);

module.exports = router;