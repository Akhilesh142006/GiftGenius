import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGiftContext } from '../context/GiftContext';
import { giftService } from '../services/api';

function Results() {
  const navigate = useNavigate();
  const { 
    relationship, 
    occasion,
    ageRange,
    recommendations, 
    error, 
    emergencyMode, 
    toggleEmergencyMode,
    budgetMin,
    budgetMax,
    interests,
    sessionId,
    reset
  } = useGiftContext();

  const [emailAddress, setEmailAddress] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emergencyGifts, setEmergencyGifts] = useState([]);
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  const relationshipLabels = {
    'family': 'Family Member',
    'friend': 'Friend',
    'colleague': 'Colleague',
    'partner': 'Partner'
  };

  const handleViewProduct = (affiliateLink) => {
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const handleSaveAndEmail = () => {
    setShowEmailForm(true);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!emailAddress) return;

    try {
      setEmailLoading(true);
      await giftService.emailRecommendations(emailAddress, recommendations, {
        relationship,
        budgetMin,
        budgetMax,
        interests
      });
      setEmailSuccess(true);
      setShowEmailForm(false);
      setTimeout(() => setEmailSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleEmergencyMode = async () => {
    if (!emergencyMode) {
      try {
        setEmergencyLoading(true);
        const response = await giftService.getEmergencyGifts(
          { min: budgetMin, max: budgetMax },
          interests
        );
        setEmergencyGifts(response.gifts);
      } catch (error) {
        console.error('Error fetching emergency gifts:', error);
        setEmergencyGifts([]);
      } finally {
        setEmergencyLoading(false);
      }
    }
    toggleEmergencyMode();
  };

  const handleStartOver = () => {
    reset();
    navigate('/');
  };

  // Debug logging
  console.log('Results component - Debug info:', {
    hasError: !!error,
    error: error,
    hasRecommendations: !!recommendations,
    recommendationsLength: recommendations?.length,
    recommendations: recommendations,
    relationship: relationship,
    sessionId: sessionId
  });

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>😅</div>
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>
            Oops! Something went wrong
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            {error}
          </p>
          
          {/* Debug information */}
          <details style={{ 
            textAlign: 'left', 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#4A90E2' }}>
              🔍 Click to see debug information
            </summary>
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <p><strong>Current Context Values:</strong></p>
              <pre style={{ background: 'white', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{JSON.stringify({ 
  relationship, 
  occasion, 
  budgetMin, 
  budgetMax, 
  ageRange, 
  interests 
}, null, 2)}
              </pre>
              <p style={{ marginTop: '10px' }}><strong>Validation:</strong></p>
              <ul>
                <li>Relationship: {relationship ? '✅' : '❌'} "{relationship}"</li>
                <li>Occasion: {occasion ? '✅' : '❌'} "{occasion}"</li>
                <li>Age Range: {ageRange ? '✅' : '❌'} "{ageRange}"</li>
                <li>Interests: {interests?.length > 0 ? '✅' : '❌'} {interests?.length || 0} selected</li>
                <li>Budget: {budgetMin && budgetMax ? '✅' : '❌'} ₹{budgetMin}-₹{budgetMax}</li>
              </ul>
              <p style={{ marginTop: '10px' }}><strong>Troubleshooting:</strong></p>
              <ol style={{ fontSize: '11px', color: '#666' }}>
                <li>Check if backend is running on port 5000</li>
                <li>Verify database has been seeded: visit /api/recommendations/debug</li>
                <li>Try the test page: /test</li>
                <li>Check browser console for detailed errors</li>
              </ol>
            </div>
          </details>
          
          <button 
            className="btn btn-primary"
            onClick={handleStartOver}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤔</div>
          <h2 style={{ color: '#666', marginBottom: '16px' }}>
            No recommendations found
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            We couldn't find any gifts matching your criteria. Try adjusting your preferences.
          </p>
          
          {/* Debug info for blank results */}
          <details style={{ 
            textAlign: 'left', 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#e74c3c' }}>
              🐛 Debug: Why are results blank?
            </summary>
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <p><strong>Current State:</strong></p>
              <ul>
                <li>Error: {error ? `"${error}"` : 'No error'}</li>
                <li>Recommendations: {recommendations ? `Array with ${recommendations.length} items` : 'null/undefined'}</li>
                <li>Session ID: {sessionId || 'Not set'}</li>
                <li>Relationship: {relationship || 'Not set'}</li>
              </ul>
              <p style={{ marginTop: '10px' }}><strong>Possible causes:</strong></p>
              <ol style={{ fontSize: '11px' }}>
                <li>API call failed silently</li>
                <li>Recommendations were not saved to context</li>
                <li>Context was reset after navigation</li>
                <li>Backend returned empty results</li>
              </ol>
              <p style={{ marginTop: '10px' }}><strong>Raw recommendations data:</strong></p>
              <pre style={{ background: 'white', padding: '8px', borderRadius: '4px', fontSize: '10px' }}>
                {JSON.stringify(recommendations, null, 2) || 'undefined'}
              </pre>
            </div>
          </details>
          
          <button 
            className="btn btn-primary"
            onClick={handleStartOver}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const giftsToShow = emergencyMode ? emergencyGifts : recommendations;

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#4A90E2',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          {emergencyMode ? 'Emergency Gifts' : `Top 3 Gifts for Your ${relationshipLabels[relationship]}`}
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '24px' 
        }}>
          {emergencyMode 
            ? 'Last-minute digital gifts and experiences'
            : 'Personalized recommendations based on your preferences'
          }
        </p>

        {/* Emergency Mode Toggle */}
        <div className="emergency-toggle">
          <h3>Need a last-minute gift? 🚨</h3>
          <p>Get instant digital gifts, gift cards, and experiences</p>
          <button 
            className={`btn ${emergencyMode ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleEmergencyMode}
            disabled={emergencyLoading}
          >
            {emergencyLoading ? 'Loading...' : emergencyMode ? 'Back to Regular Gifts' : 'Emergency Gift Mode'}
          </button>
        </div>
      </div>

      {/* Gift Recommendations */}
      {giftsToShow.map((gift, index) => (
        <div key={gift.giftId || index} className="gift-card">
          <div className="gift-header">
            <div>
              <h3 className="gift-name">{gift.name}</h3>
              {gift.reason && (
                <p className="gift-reason">{gift.reason}</p>
              )}
            </div>
            <div className="gift-price">₹{gift.price}</div>
          </div>
          
          {gift.matchScore && (
            <div className="gift-match">{gift.matchScore}% Match</div>
          )}
          
          <div className="gift-actions">
            <button 
              className="btn btn-primary btn-small"
              onClick={() => handleViewProduct(gift.affiliateLink)}
            >
              View Product
            </button>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="card">
        {emailSuccess && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            ✅ Recommendations sent to your email!
          </div>
        )}

        {showEmailForm ? (
          <form onSubmit={handleEmailSubmit}>
            <h3 style={{ marginBottom: '16px', color: '#4A90E2' }}>
              Email These Recommendations
            </h3>
            <div className="form-group">
              <input 
                type="email"
                className="form-select"
                placeholder="Enter your email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowEmailForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-success"
                disabled={emailLoading || !emailAddress}
              >
                {emailLoading ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button 
              className="btn btn-success btn-full"
              onClick={handleSaveAndEmail}
            >
              📧 Save & Email These Recommendations
            </button>
            <button 
              className="btn btn-secondary btn-full"
              onClick={handleStartOver}
            >
              🔄 Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;