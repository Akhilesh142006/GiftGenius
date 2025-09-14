import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGiftContext } from '../context/GiftContext';

function RelationshipOccasion() {
  const navigate = useNavigate();
  const { 
    relationship, 
    occasion, 
    setRelationship, 
    setOccasion 
  } = useGiftContext();

  const relationships = [
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'friend', label: 'Friend', icon: '👥' },
    { id: 'colleague', label: 'Colleague', icon: '💼' },
    { id: 'partner', label: 'Partner', icon: '💕' }
  ];

  const occasions = [
    { id: 'birthday', label: 'Birthday', icon: '🎂' },
    { id: 'holiday', label: 'Holiday', icon: '🎄' },
    { id: 'anniversary', label: 'Anniversary', icon: '💍' },
    { id: 'thank-you', label: 'Thank You', icon: '🙏' },
    { id: 'just-because', label: 'Just Because', icon: '💝' }
  ];

  const handleNext = () => {
    if (relationship && occasion) {
      navigate('/budget-age');
    }
  };

  const isNextEnabled = relationship && occasion;

  return (
    <div className="container">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '33%' }}></div>
      </div>

      <div className="card">
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#333'
        }}>
          Step 1 of 3
        </h2>
        
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#4A90E2'
          }}>
            Who are you shopping for?
          </h3>
          <div className="choice-grid">
            {relationships.map((rel) => (
              <button
                key={rel.id}
                className={`choice-btn ${relationship === rel.id ? 'selected' : ''}`}
                onClick={() => setRelationship(rel.id)}
              >
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                    {rel.icon}
                  </div>
                  {rel.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#4A90E2'
          }}>
            What's the occasion?
          </h3>
          <div className="choice-grid">
            {occasions.map((occ) => (
              <button
                key={occ.id}
                className={`choice-btn ${occasion === occ.id ? 'selected' : ''}`}
                onClick={() => setOccasion(occ.id)}
              >
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                    {occ.icon}
                  </div>
                  {occ.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="navigation">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Back
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isNextEnabled}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default RelationshipOccasion;