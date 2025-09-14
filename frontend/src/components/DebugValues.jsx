import React from 'react';
import { useGiftContext } from '../context/GiftContext';

function DebugValues() {
  const { 
    relationship, 
    occasion, 
    budgetMin, 
    budgetMax, 
    ageRange, 
    interests 
  } = useGiftContext();

  const preferences = {
    relationship,
    occasion,
    budgetMin,
    budgetMax,
    ageRange,
    interests
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      background: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{ color: '#4A90E2', marginBottom: '16px' }}>🔍 Debug: Current Context Values</h3>
      
      <div style={{ background: 'white', padding: '15px', borderRadius: '5px', marginBottom: '10px' }}>
        <strong>Raw Values:</strong>
        <ul style={{ marginTop: '10px', fontSize: '14px' }}>
          <li><strong>Relationship:</strong> "{relationship}" (type: {typeof relationship})</li>
          <li><strong>Occasion:</strong> "{occasion}" (type: {typeof occasion})</li>
          <li><strong>Budget Min:</strong> {budgetMin} (type: {typeof budgetMin})</li>
          <li><strong>Budget Max:</strong> {budgetMax} (type: {typeof budgetMax})</li>
          <li><strong>Age Range:</strong> "{ageRange}" (type: {typeof ageRange})</li>
          <li><strong>Interests:</strong> {Array.isArray(interests) ? `[${interests.join(', ')}]` : 'NOT_ARRAY'} (length: {interests?.length})</li>
        </ul>
      </div>

      <div style={{ background: 'white', padding: '15px', borderRadius: '5px' }}>
        <strong>JSON that will be sent to API:</strong>
        <pre style={{ 
          background: '#f8f9fa', 
          padding: '10px', 
          borderRadius: '4px', 
          fontSize: '12px',
          overflow: 'auto',
          marginTop: '10px'
        }}>
          {JSON.stringify(preferences, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '15px', padding: '10px', background: preferences.relationship && preferences.occasion && preferences.ageRange && interests?.length > 0 ? '#d4edda' : '#f8d7da', borderRadius: '5px' }}>
        <strong>Validation Status:</strong>
        <ul style={{ marginTop: '8px', fontSize: '13px' }}>
          <li style={{ color: relationship ? 'green' : 'red' }}>
            Relationship: {relationship ? '✅ Set' : '❌ Missing'}
          </li>
          <li style={{ color: occasion ? 'green' : 'red' }}>
            Occasion: {occasion ? '✅ Set' : '❌ Missing'}
          </li>
          <li style={{ color: ageRange ? 'green' : 'red' }}>
            Age Range: {ageRange ? '✅ Set' : '❌ Missing'}
          </li>
          <li style={{ color: interests?.length > 0 ? 'green' : 'red' }}>
            Interests: {interests?.length > 0 ? `✅ ${interests.length} selected` : '❌ None selected'}
          </li>
          <li style={{ color: (budgetMin >= 10 && budgetMax <= 1000 && budgetMin <= budgetMax) ? 'green' : 'red' }}>
            Budget: {(budgetMin >= 10 && budgetMax <= 1000 && budgetMin <= budgetMax) ? '✅ Valid' : '❌ Invalid'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DebugValues;