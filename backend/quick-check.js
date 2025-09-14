// Quick database check
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Gift } from './models/index.js';

dotenv.config();

const quickCheck = async () => {
  try {
    console.log('🔍 Quick Database Check\n');
    
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.log('❌ MONGODB_URI not found in .env file');
      return;
    }
    
    console.log('🔗 Connecting to:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@'));
    await mongoose.connect(mongoURI);
    console.log('✅ Connected\n');
    
    const count = await Gift.countDocuments();
    console.log(`📦 Total gifts in database: ${count}`);
    
    if (count === 0) {
      console.log('❌ Database is empty! Run: npm run seed');
    } else {
      console.log('✅ Database has gift data');
      
      // Show first gift as example
      const firstGift = await Gift.findOne();
      console.log('📝 Sample gift:', {
        name: firstGift.name,
        price: firstGift.price,
        interests: firstGift.interests,
        relationships: firstGift.relationships
      });
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

quickCheck();