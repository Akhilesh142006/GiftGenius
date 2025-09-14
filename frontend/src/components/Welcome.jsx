import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/relationship-occasion');
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginTop: '40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎁</div>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#4A90E2', 
          marginBottom: '16px' 
        }}>
          Welcome to GiftGenius
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: '#666', 
          marginBottom: '40px',
          lineHeight: '1.5'
        }}>
          Find the perfect gift in 3 minutes
        </p>
        <p style={{ 
          fontSize: '16px', 
          color: '#888', 
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Answer a few simple questions and let our AI recommend personalized gifts 
          that your recipient will absolutely love.
        </p>
        <button 
          className="btn btn-primary btn-full"
          onClick={handleGetStarted}
          style={{ fontSize: '18px', padding: '16px 32px' }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Welcome;