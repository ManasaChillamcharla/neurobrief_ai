const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

let connectionPromise = null;

const maskMongoUri = (uri) => uri.replace(/:([^:@]+)@/, ':****@');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  try {
    const mongoUri = process.env.MONGO_URI || (
      process.env.NODE_ENV === 'production'
        ? ''
        : 'mongodb://127.0.0.1:27017/neurobriefai'
    );

    if (!mongoUri) {
      throw new Error('MONGO_URI is not configured. Add a MongoDB Atlas connection string in Vercel Environment Variables.');
    }
    
    console.log(`[Database] Attempting connection to MongoDB at: ${maskMongoUri(mongoUri)}`);
    
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    const conn = await connectionPromise;
    
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Bind connection events for runtime tracking
    mongoose.connection.on('error', (err) => {
      console.error(`[Database] Connection lost error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] Mongoose connection disconnected.');
    });
    return conn.connection;
  } catch (error) {
    connectionPromise = null;
    console.error(`[Database] Initial Connection Error: ${error.message}`);
    console.error('[Database] Verify MONGO_URI in Vercel uses MongoDB Atlas, and the Atlas network access allows Vercel connections.');
    throw error;
  }
};

module.exports = connectDB;
