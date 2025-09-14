import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const giftService = {
  // Get gift recommendations
  getRecommendations: async (preferences) => {
    try {
      const response = await api.post('/recommendations', preferences);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get recommendations');
    }
  },

  // Get emergency gifts
  getEmergencyGifts: async (budget, interests) => {
    try {
      const response = await api.post('/emergency', { budget, interests });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get emergency gifts');
    }
  },

  // Save recommendations
  saveRecommendations: async (sessionId, recommendations) => {
    try {
      const response = await api.post('/save-recommendations', {
        sessionId,
        recommendations
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save recommendations');
    }
  },

  // Email recommendations
  emailRecommendations: async (email, recommendations, preferences) => {
    try {
      const response = await api.post('/email-recommendations', {
        email,
        recommendations,
        preferences
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send email');
    }
  }
};

export const chatbotService = {
  // Send message to chatbot
  sendMessage: async (data) => {
    try {
      const response = await api.post('/chatbot', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get chatbot response');
    }
  }
};

export default api;