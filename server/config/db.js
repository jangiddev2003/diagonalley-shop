// ============================================
// DATABASE CONNECTION (MongoDB via Mongoose)
// ============================================
// This file creates and exports a function that connects our Express server
// to a MongoDB database using Mongoose (an ODM — Object Data Modeling library).

import mongoose from 'mongoose';

/**
 * connectDB — Connects to MongoDB using the URI from environment variables.
 * If the connection fails, the server process exits with an error code.
 */
const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise. We await it to make sure
    // we're connected before the server starts accepting requests.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails (wrong URI, MongoDB not running, etc.),
    // we log the error and shut down the server immediately.
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit code 1 = failure
  }
};

export default connectDB;
