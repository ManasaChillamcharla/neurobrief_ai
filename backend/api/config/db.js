const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neurobriefai';
    
    console.log(`[Database] Attempting connection to MongoDB at: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // Time out after 5s
    });
    
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Bind connection events for runtime tracking
    mongoose.connection.on('error', (err) => {
      console.error(`[Database] Connection lost error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] Mongoose connection disconnected.');
    });
    
  } catch (error) {
    console.error(`[Database] Initial Connection Error: ${error.message}`);
    console.error('[Database] Please verify your local MongoDB service is running via "MongoDB Compass" or "services.msc" on port 27017.');
    // Do not crash the entire app server in serverless mode, but log clearly
  }
};

module.exports = connectDB;
