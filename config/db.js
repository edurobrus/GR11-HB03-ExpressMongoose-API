const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cbd';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('✔️  MongoDB connected');
  } catch (error) {
    console.error('❌  MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

