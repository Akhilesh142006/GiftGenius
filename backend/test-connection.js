// Test MongoDB connection and seed database
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('Attempting to connect to:', mongoURI?.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@'));
    
    await mongoose.connect(mongoURI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`🌐 Database: ${mongoose.connection.name}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();