// Simple test to verify what works
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Gift } from './models/index.js';
import RecommendationEngine from './services/recommendationEngine.js';

dotenv.config();

const testRecommendations = async () => {
  try {
    console.log('🧪 Testing Recommendations...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');
    
    // Check if we have gifts
    const giftCount = await Gift.countDocuments();
    console.log(`📦 Total gifts: ${giftCount}`);
    
    if (giftCount === 0) {
      console.log('❌ No gifts found! Run: npm run seed');
      return;
    }
    
    // Show sample gifts
    const sampleGifts = await Gift.find().limit(3);
    console.log('\n📝 Sample gifts:');
    sampleGifts.forEach(gift => {
      console.log(`- ${gift.name} ($${gift.price})`);
      console.log(`  Interests: ${gift.interests.join(', ')}`);
      console.log(`  Relationships: ${gift.relationships.join(', ')}`);
      console.log(`  Occasions: ${gift.occasions.join(', ')}`);
      console.log(`  Age Groups: ${gift.ageGroups.join(', ')}\n`);
    });
    
    // Test with guaranteed working inputs
    const testCases = [
      {
        name: 'Test Case 1 - Technology Friend',
        preferences: {
          relationship: 'friend',
          occasion: 'birthday', 
          budgetMin: 20,
          budgetMax: 100,
          ageRange: '18-30',
          interests: ['technology']
        }
      },
      {
        name: 'Test Case 2 - Music Lover',
        preferences: {
          relationship: 'friend',
          occasion: 'birthday',
          budgetMin: 50,
          budgetMax: 150,
          ageRange: '18-30', 
          interests: ['music']
        }
      },
      {
        name: 'Test Case 3 - Broad Search',
        preferences: {
          relationship: 'family',
          occasion: 'holiday',
          budgetMin: 10,
          budgetMax: 200,
          ageRange: '30-45',
          interests: ['technology', 'books']
        }
      }
    ];
    
    const engine = new RecommendationEngine();
    
    for (const testCase of testCases) {
      console.log(`\n🔍 ${testCase.name}`);
      console.log('Input:', testCase.preferences);
      
      try {
        const recommendations = await engine.getRecommendations(testCase.preferences);
        console.log(`✅ Got ${recommendations.length} recommendations:`);
        
        recommendations.forEach((gift, i) => {
          console.log(`  ${i+1}. ${gift.name} - $${gift.price} (${gift.matchScore}% match)`);
        });
      } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testRecommendations();