import React, { useState } from 'react';
import { giftService } from '../services/api';

function APITest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      // Test with simple preferences
      const testPreferences = {
        relationship: 'friend',
        occasion: 'birthday',
        budgetMin: 25,
        budgetMax: 100,
        ageRange: '18-30',
        interests: ['technology']
      };
      
      console.log('Testing API with:', testPreferences);
      const response = await giftService.getRecommendations(testPreferences);
      setResult({ success: true, data: response });
    } catch (error) {
      console.error('API Test failed:', error);
      setResult({ 
        success: false, 
        error: error.message,
        details: error.response?.data 
      });
    } finally {
      setLoading(false);
    }
  };

  const testDebug = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/recommendations/debug');
      const data = await response.json();
      setResult({ success: true, debug: data });
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>API Test Page</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testDebug} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading ? 'Testing...' : 'Test Database'}
        </button>
        
        <button 
          onClick={testAPI} 
          disabled={loading}
          style={{ padding: '10px', background: '#7ED321', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading ? 'Testing...' : 'Test Recommendations'}
        </button>
      </div>

      {result && (
        <div style={{ 
          background: result.success ? '#f0f8f0' : '#f8f0f0', 
          padding: '15px', 
          borderRadius: '5px',
          border: `1px solid ${result.success ? '#7ED321' : '#e74c3c'}`
        }}>
          <h3>{result.success ? '✅ Success' : '❌ Error'}</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default APITest;