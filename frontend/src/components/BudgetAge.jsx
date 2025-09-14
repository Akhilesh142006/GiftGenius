import React, { useState } from 'react';
// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGiftContext } from '../context/GiftContext';

function BudgetAge() {
  const navigate = useNavigate();
  const { 
    budgetMin, 
    budgetMax, 
    ageRange, 
    setBudget, 
    setAgeRange 
  } = useGiftContext();

  const [localMinBudget, setLocalMinBudget] = useState(budgetMin);
  const [localMaxBudget, setLocalMaxBudget] = useState(budgetMax);

  const ageRanges = [
    { id: 'under-18', label: 'Under 18' },
    { id: '18-30', label: '18-30' },
    { id: '30-45', label: '30-45' },
    { id: '45+', label: '45+' }
  ];

  const handleMinBudgetChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalMinBudget(value);
    if (value <= localMaxBudget) {
      setBudget(value, localMaxBudget);
    }
  };

  const handleMaxBudgetChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalMaxBudget(value);
    if (value >= localMinBudget) {
      setBudget(localMinBudget, value);
    }
  };

  const handleNext = () => {
    if (ageRange) {
      navigate('/interests');
    }
  };

  const isNextEnabled = ageRange;

  return (
    <div className="container">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '66%' }}></div>
      </div>

      <div className="card">
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#333'
        }}>
          Step 2 of 3
        </h2>
        
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#4A90E2'
          }}>
            What's your budget?
          </h3>
          
          <div className="slider-container">
            <div className="slider-labels">
              <span>₹100</span>
              <span>₹100,000</span>
            </div>
            
            <div className="dual-slider">
              <input
                type="range"
                min="100"
                max="100000"
                step="500"
                value={localMinBudget}
                onChange={handleMinBudgetChange}
                style={{ zIndex: 1 }}
              />
              <input
                type="range"
                min="100"
                max="100000"
                step="500"
                value={localMaxBudget}
                onChange={handleMaxBudgetChange}
                style={{ zIndex: 2 }}
              />
            </div>
            
            <div className="slider-value">
              ₹{budgetMin} - ₹{budgetMax}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#4A90E2'
          }}>
            Age range of the recipient?
          </h3>
          
          <div className="form-group">
            <select 
              className="form-select"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            >
              <option value="">Select age range</option>
              {ageRanges.map((age) => (
                <option key={age.id} value={age.id}>
                  {age.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="navigation">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/relationship-occasion')}
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

export default BudgetAge;