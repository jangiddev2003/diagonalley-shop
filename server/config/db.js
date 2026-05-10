// ============================================
// DATABASE CONNECTION (MongoDB via Mongoose)
// ============================================

import mongoose from 'mongoose';

/**
 * connectDB — Connects to MongoDB using the URI from environment variables.
 * On failure, logs the error but does NOT crash the server so it can be retried.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,          // Force IPv4 — fixes Atlas SRV DNS on Windows
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️  Server is running but database is NOT connected.');
    console.error('⚠️  Please set a valid MONGO_URI in server/.env and restart.');
  }
};

export default connectDB;

