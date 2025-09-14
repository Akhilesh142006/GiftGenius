// Debug script to test API and database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Gift } from './models/index.js';
import RecommendationEngine from './services/recommendationEngine.js';

dotenv.config();

const debugAPI = async () => {
  try {
    console.log('🔍 Starting API Debug...\n');
    
    // 1. Test MongoDB connection
    console.log('1️⃣ Testing MongoDB Connection...');
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI not found in .env file');
    }
    
    console.log('URI (masked):', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@'));
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);
    
    // 2. Check gift data
    console.log('2️⃣ Checking Gift Data...');
    const totalGifts = await Gift.countDocuments();
    console.log(`📦 Total gifts in database: ${totalGifts}`);
    
    if (totalGifts === 0) {
      console.log('❌ No gifts found! You need to run the seed script first.');
      console.log('Run: npm run seed\n');
      return;
    }
    
    const sampleGift = await Gift.findOne();
    console.log('📝 Sample gift:', {
      name: sampleGift.name,
      price: sampleGift.price,
      interests: sampleGift.interests,
      relationships: sampleGift.relationships,
      occasions: sampleGift.occasions,
      ageGroups: sampleGift.ageGroups
    });
    console.log('');
    
    // 3. Test recommendation engine
    console.log('3️⃣ Testing Recommendation Engine...');
    const engine = new RecommendationEngine();
    
    const testPreferences = {
      relationship: 'friend',
      occasion: 'birthday',
      budgetMin: 25,
      budgetMax: 100,
      ageRange: '18-30',
      interests: ['technology', 'music']
    };
    
    console.log('🧪 Test preferences:', testPreferences);
    
    const recommendations = await engine.getRecommendations(testPreferences);
    console.log(`✅ Got ${recommendations.length} recommendations`);
    
    recommendations.forEach((gift, index) => {
      console.log(`${index + 1}. ${gift.name} - $${gift.price} (${gift.matchScore}% match)`);
      console.log(`   Reason: ${gift.reason}`);
    });
    
    console.log('\n🎉 All tests passed! Your API should work properly.');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

debugAPI();