// Quick API test to see what's wrong
import fetch from 'node-fetch';

const testAPI = async () => {
  try {
    console.log('🔍 Testing API endpoints...\n');
    
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    try {
      const healthResponse = await fetch('http://localhost:5000/health');
      const healthData = await healthResponse.json();
      console.log('✅ Health check:', healthData);
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      console.log('💡 Backend might not be running on port 5000');
      return;
    }
    
    // Test 2: Debug endpoint
    console.log('\n2️⃣ Testing debug endpoint...');
    try {
      const debugResponse = await fetch('http://localhost:5000/api/recommendations/debug');
      const debugData = await debugResponse.json();
      console.log('✅ Debug data:', debugData);
      
      if (debugData.database?.totalGifts === 0) {
        console.log('\n❌ Database is empty! Run: npm run seed');
        return;
      }
    } catch (error) {
      console.log('❌ Debug endpoint failed:', error.message);
    }
    
    // Test 3: Actual recommendation call
    console.log('\n3️⃣ Testing recommendation endpoint...');
    const testPreferences = {
      relationship: 'friend',
      occasion: 'birthday',
      budgetMin: 25,
      budgetMax: 150,
      ageRange: '18-30',
      interests: ['technology']
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPreferences)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Recommendation API working!');
        console.log(`Got ${data.recommendations?.length || 0} recommendations`);
      } else {
        console.log('❌ Recommendation API failed:');
        console.log('Status:', response.status);
        console.log('Error:', data);
      }
    } catch (error) {
      console.log('❌ Recommendation call failed:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Overall test failed:', error.message);
  }
};

testAPI();