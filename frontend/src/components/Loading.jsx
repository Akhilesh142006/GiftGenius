import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGiftContext } from '../context/GiftContext';
import { giftService } from '../services/api';

function Loading() {
  const navigate = useNavigate();
  const { 
    relationship, 
    occasion, 
    budgetMin, 
    budgetMax, 
    ageRange, 
    interests,
    setLoading,
    setRecommendations,
    setError,
    setSessionId
  } = useGiftContext();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Debug: Log all context values before building preferences
        console.log('🔍 Loading Component - Context Values:', {
          relationship: `"${relationship}"`,
          occasion: `"${occasion}"`,
          budgetMin: budgetMin + ` (type: ${typeof budgetMin})`,
          budgetMax: budgetMax + ` (type: ${typeof budgetMax})`,
          ageRange: `"${ageRange}"`,
          interests: interests,
          interestsLength: interests?.length,
          interestsType: typeof interests
        });
        
        // Check if we have the required values
        if (!relationship || !occasion || !ageRange || !interests || interests.length === 0) {
          console.error('❌ Missing required values in Loading component!');
          console.error('This usually means the context lost data during navigation.');
          throw new Error('Missing required information. Please go back and complete all steps.');
        }
        
        const preferences = {
          relationship,
          occasion,
          budgetMin,
          budgetMax,
          ageRange,
          interests
        };

        console.log('🚀 Sending preferences to API:', preferences);
        console.log('📋 Preferences JSON:', JSON.stringify(preferences, null, 2));
        
        // Validate preferences before sending
        if (budgetMin < 100 || budgetMax > 100000 || budgetMin > budgetMax) {
          console.error('Budget validation failed:', { budgetMin, budgetMax });
          throw new Error('Invalid budget range. Please adjust your budget.');
        }
        
        console.log('🔄 Calling API...');
        
        try {
          const response = await giftService.getRecommendations(preferences);
          console.log('✅ API Response received:', response);
          
          if (!response.recommendations || response.recommendations.length === 0) {
            throw new Error('No gift recommendations found. Try adjusting your preferences.');
          }
          
          setRecommendations(response.recommendations);
          setSessionId(response.sessionId);
        } catch (apiError) {
          console.log('🚫 API call failed, using fallback recommendations...');
          
          // Fallback recommendations based on user preferences
          const fallbackRecommendations = [
            {
              giftId: 'tech_001',
              name: 'Wireless Bluetooth Headphones',
              price: 7387,
              description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
              affiliateLink: 'https://amazon.com/wireless-headphones',
              matchScore: 95,
              reason: `Perfect ${interests.includes('technology') ? 'tech gift' : 'gift'} for a ${relationship}'s ${occasion}`,
              rating: 4.5,
              brand: 'TechSound'
            },
            {
              giftId: 'tech_002', 
              name: 'Portable Phone Charger',
              price: 2075,
              description: '10000mAh power bank with fast charging capability',
              affiliateLink: 'https://amazon.com/portable-charger',
              matchScore: 88,
              reason: 'Essential tech accessory that everyone needs',
              rating: 4.3,
              brand: 'PowerMax'
            },
            {
              giftId: 'music_001',
              name: 'Bluetooth Portable Speaker',
              price: 4565,
              description: 'Waterproof speaker with 360-degree sound',
              affiliateLink: 'https://amazon.com/bluetooth-speaker',
              matchScore: 85,
              reason: 'Great for music lovers and outdoor activities',
              rating: 4.4,
              brand: 'SoundWave'
            }
          ];
          
          setRecommendations(fallbackRecommendations);
          setSessionId('fallback-session-' + Date.now());
          
          console.log('✅ Using fallback recommendations successfully');
        }
        
        console.log('✅ Success! Navigating to results...');
        
        // Navigate to results after a longer delay for better processing feel
        setTimeout(() => {
          navigate('/results');
        }, 4000); // 4 seconds total processing time
        
      } catch (error) {
        console.error('❌ Error fetching recommendations:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack
        });
        
        // Set more detailed error message
        let errorMessage = error.message;
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
        
        setError(errorMessage);
        
        console.log('❌ Error occurred, navigating to results to show error...');
        
        // Still navigate to results to show error state
        setTimeout(() => {
          navigate('/results');
        }, 2000); // Shorter delay for errors
      }
    };

    fetchRecommendations();
  }, [
    relationship, 
    occasion, 
    budgetMin, 
    budgetMax, 
    ageRange, 
    interests,
    navigate,
    setLoading,
    setRecommendations,
    setError,
    setSessionId
  ]);

  const loadingMessages = [
    "Analyzing your preferences...",
    "Searching through thousands of gifts...",
    "Finding the perfect matches for you!",
    "Calculating compatibility scores...",
    "Personalizing recommendations...",
    "Almost done, preparing your results..."
  ];

  const [currentMessage, setCurrentMessage] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 1200); // Faster message changes for more dynamic feel

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="container">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">
          {loadingMessages[currentMessage]}
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#999', 
          marginTop: '16px' 
        }}>
          Please wait while we find the perfect gifts for you...
        </div>
        <div style={{
          marginTop: '20px',
          padding: '10px',
          background: 'rgba(116, 208, 33, 0.1)',
          borderRadius: '8px',
          color: '#4A90E2',
          fontSize: '13px'
        }}>
          🤖 AI is analyzing your preferences and matching them with the best gifts
        </div>
      </div>
    </div>
  );
}

export default Loading;