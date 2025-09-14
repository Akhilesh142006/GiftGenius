import express from 'express';
import RecommendationEngine from '../services/recommendationEngine.js';

const router = express.Router();
const recommendationEngine = new RecommendationEngine();

/**
 * POST /api/emergency
 * Get emergency gifts (instant delivery digital gifts)
 */
router.post('/', async (req, res) => {
  try {
    const { budget, interests } = req.body;

    // Validate required fields
    if (!budget || typeof budget !== 'object') {
      return res.status(400).json({
        error: 'Budget object is required',
        format: 'budget: { min: number, max: number }'
      });
    }

    const { min: budgetMin, max: budgetMax } = budget;

    // Validate budget values
    if (!budgetMin || !budgetMax || budgetMin < 10 || budgetMax > 1000 || budgetMin > budgetMax) {
      return res.status(400).json({
        error: 'Invalid budget range. Min: $10, Max: $1000, and min must be less than max'
      });
    }

    // Interests are optional for emergency gifts
    const validInterests = interests && Array.isArray(interests) ? interests : [];

    console.log('Getting emergency gifts for budget:', budget, 'interests:', validInterests);

    // Get emergency gifts from AI engine
    const emergencyGifts = await recommendationEngine.getEmergencyGifts(budget, validInterests);

    if (emergencyGifts.length === 0) {
      return res.status(404).json({
        error: 'No emergency gifts found',
        message: 'No instant delivery gifts available for your budget range. Try adjusting your budget.',
        suggestions: [
          'Increase your budget range',
          'Try different interest categories',
          'Consider generic gift cards'
        ]
      });
    }

    res.json({
      success: true,
      gifts: emergencyGifts,
      count: emergencyGifts.length,
      message: `Found ${emergencyGifts.length} instant delivery gifts`,
      deliveryInfo: {
        type: 'Digital/Instant',
        timeframe: 'Delivered within minutes via email',
        note: 'Perfect for last-minute gifting'
      }
    });

  } catch (error) {
    console.error('Emergency gifts API error:', error);
    
    res.status(500).json({
      error: 'Failed to get emergency gifts',
      message: error.message
    });
  }
});

/**
 * GET /api/emergency/categories
 * Get available emergency gift categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      {
        name: 'Gift Cards',
        description: 'Digital gift cards for popular retailers',
        examples: ['Amazon', 'Target', 'Best Buy'],
        deliveryTime: 'Instant'
      },
      {
        name: 'Streaming Services',
        description: 'Entertainment subscriptions',
        examples: ['Netflix', 'Spotify', 'Disney+'],
        deliveryTime: 'Instant'
      },
      {
        name: 'Digital Experiences',
        description: 'Online courses, masterclasses, virtual events',
        examples: ['MasterClass', 'Udemy', 'Virtual Concert Tickets'],
        deliveryTime: 'Instant'
      },
      {
        name: 'App Store Credits',
        description: 'Credits for mobile apps and games',
        examples: ['iTunes', 'Google Play', 'Steam'],
        deliveryTime: 'Instant'
      }
    ];

    res.json({
      success: true,
      categories,
      note: 'All emergency gifts are delivered digitally within minutes'
    });

  } catch (error) {
    console.error('Emergency categories error:', error);
    
    res.status(500).json({
      error: 'Failed to get emergency categories',
      message: error.message
    });
  }
});

export default router;