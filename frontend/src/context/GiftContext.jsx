import React, { createContext, useContext, useReducer } from 'react';

const GiftContext = createContext();

const initialState = {
  relationship: '',
  occasion: '',
  budgetMin: 1000,
  budgetMax: 10000,
  ageRange: '',
  interests: [],
  recommendations: [],
  sessionId: null,
  loading: false,
  error: null,
  emergencyMode: false
};

// Load state from localStorage if available
const loadStateFromStorage = () => {
  try {
    const savedState = localStorage.getItem('giftGenius_state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      console.log('Loaded state from localStorage:', parsed);
      return { ...initialState, ...parsed };
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};

// Save state to localStorage
const saveStateToStorage = (state) => {
  try {
    // Only save user input data, not transient states
    const stateToSave = {
      relationship: state.relationship,
      occasion: state.occasion,
      budgetMin: state.budgetMin,
      budgetMax: state.budgetMax,
      ageRange: state.ageRange,
      interests: state.interests,
      recommendations: state.recommendations,
      sessionId: state.sessionId
    };
    localStorage.setItem('giftGenius_state', JSON.stringify(stateToSave));
    console.log('Saved state to localStorage:', stateToSave);
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

function giftReducer(state, action) {
  switch (action.type) {
    case 'SET_RELATIONSHIP':
      return { ...state, relationship: action.payload };
    case 'SET_OCCASION':
      return { ...state, occasion: action.payload };
    case 'SET_BUDGET':
      return { ...state, budgetMin: action.payload.min, budgetMax: action.payload.max };
    case 'SET_AGE_RANGE':
      return { ...state, ageRange: action.payload };
    case 'SET_INTERESTS':
      return { ...state, interests: action.payload };
    case 'TOGGLE_INTEREST':
      const currentInterests = state.interests;
      const interest = action.payload;
      const newInterests = currentInterests.includes(interest)
        ? currentInterests.filter(i => i !== interest)
        : [...currentInterests, interest];
      return { ...state, interests: newInterests };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload, loading: false };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'TOGGLE_EMERGENCY_MODE':
      return { ...state, emergencyMode: !state.emergencyMode };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function GiftContextProvider({ children }) {
  const [state, dispatch] = useReducer(giftReducer, null, loadStateFromStorage);
  
  // Save state to localStorage whenever it changes (except for loading/error states)
  React.useEffect(() => {
    saveStateToStorage(state);
  }, [state.relationship, state.occasion, state.budgetMin, state.budgetMax, state.ageRange, state.interests, state.recommendations, state.sessionId]);

  const setRelationship = (relationship) => {
    dispatch({ type: 'SET_RELATIONSHIP', payload: relationship });
  };

  const setOccasion = (occasion) => {
    dispatch({ type: 'SET_OCCASION', payload: occasion });
  };

  const setBudget = (min, max) => {
    dispatch({ type: 'SET_BUDGET', payload: { min, max } });
  };

  const setAgeRange = (ageRange) => {
    dispatch({ type: 'SET_AGE_RANGE', payload: ageRange });
  };

  const setInterests = (interests) => {
    dispatch({ type: 'SET_INTERESTS', payload: interests });
  };

  const toggleInterest = (interest) => {
    dispatch({ type: 'TOGGLE_INTEREST', payload: interest });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setRecommendations = (recommendations) => {
    dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
  };

  const setSessionId = (sessionId) => {
    dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const toggleEmergencyMode = () => {
    dispatch({ type: 'TOGGLE_EMERGENCY_MODE' });
  };

  const reset = () => {
    localStorage.removeItem('giftGenius_state');
    dispatch({ type: 'RESET' });
  };

  const value = {
    ...state,
    setRelationship,
    setOccasion,
    setBudget,
    setAgeRange,
    setInterests,
    toggleInterest,
    setLoading,
    setRecommendations,
    setSessionId,
    setError,
    toggleEmergencyMode,
    reset
  };

  return (
    <GiftContext.Provider value={value}>
      {children}
    </GiftContext.Provider>
  );
}

export function useGiftContext() {
  const context = useContext(GiftContext);
  if (!context) {
    throw new Error('useGiftContext must be used within a GiftContextProvider');
  }
  return context;
}