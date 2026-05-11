// ============================================
// DATABASE CONNECTION (MongoDB via Mongoose)
// ============================================

import mongoose from 'mongoose';

/**
 * connectDB — Connects to MongoDB Atlas with retry logic.
 * Retries up to 5 times before giving up, so Render cold-starts
 * and Atlas wakeup delays don't permanently break the connection.
 */
const connectDB = async (retries = 5) => {
  try {
    console.log(`🔌 Attempting MongoDB connection... (MONGO_URI set: ${!!process.env.MONGO_URI})`);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,  // 30s — gives Atlas time to wake up
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (retries > 0) {
      console.log(`🔁 Retrying connection... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5s
      return connectDB(retries - 1);
    }
    console.error('💀 Could not connect to MongoDB after multiple attempts. Check MONGO_URI and Atlas Network Access.');
    process.exit(1); // Force Render to restart the service
  }
};

export default connectDB;
