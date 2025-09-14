import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGiftContext } from '../context/GiftContext';

function Interests() {
  const navigate = useNavigate();
  const { interests, toggleInterest } = useGiftContext();

  const interestOptions = [
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'art', label: 'Art', icon: '🎨' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'cooking', label: 'Cooking', icon: '👨‍🍳' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'fashion', label: 'Fashion', icon: '👗' }
  ];

  const handleSubmit = () => {
    if (interests.length > 0) {
      navigate('/loading');
    }
  };

  const isSubmitEnabled = interests.length > 0;

  return (
    <div className="container">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '100%' }}></div>
      </div>

      <div className="card">
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#333'
        }}>
          Step 3 of 3
        </h2>
        
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#4A90E2'
          }}>
            What are their interests?
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginBottom: '20px' 
          }}>
            Select all that apply (minimum 1 required)
          </p>
          
          <div className="interests-grid">
            {interestOptions.map((interest) => (
              <div
                key={interest.id}
                className={`interest-card ${interests.includes(interest.id) ? 'selected' : ''}`}
                onClick={() => toggleInterest(interest.id)}
              >
                <div className="interest-icon">{interest.icon}</div>
                <div className="interest-label">{interest.label}</div>
              </div>
            ))}
          </div>
          
          {interests.length > 0 && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#f8fff4', 
              borderRadius: '8px',
              border: '1px solid #7ED321'
            }}>
              <strong style={{ color: '#7ED321' }}>Selected:</strong>{' '}
              <span style={{ color: '#333' }}>
                {interests.map(id => 
                  interestOptions.find(opt => opt.id === id)?.label
                ).join(', ')}
              </span>
            </div>
          )}
        </div>

        <div className="navigation">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/budget-age')}
          >
            Back
          </button>
          <button 
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            🎁 Find My Perfect Gifts!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Interests;