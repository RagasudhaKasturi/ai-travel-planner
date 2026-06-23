const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('Missing MONGO_URI in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
