require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Express Configuration Middlewares
app.use(cors({
  origin: '*', // Allow all origins for Vercel serverless accessibility
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' })); // support larger textual parsing packages
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check API Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'NeuroBrief AI Backend',
    message: 'Backend is running. Use /api/health for health checks and deploy the frontend as a separate Vercel project from the frontend directory.',
    health: '/api/health',
    timestamp: new Date()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NeuroBrief AI System Backend is active and healthy.',
    timestamp: new Date()
  });
});

// Ensure database availability before protected app APIs hit controllers.
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }

  try {
    await connectDB();
    return next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Check MONGO_URI in Vercel Environment Variables and MongoDB Atlas Network Access.',
      detail: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
});

// Bind Controller Routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/summaries', require('./routes/summary'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notes', require('./routes/note'));

// Global error handler for robust crash resistance
app.use((err, req, res, next) => {
  console.error(`[Global Error Handler] ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server execution error.'
  });
});

// Standard Port Listener for standalone execution (Vercel invokes exports directly)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Server] NeuroBrief AI running in standalone mode on port ${PORT}`);
    console.log(`[Server] Live dashboard API: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
