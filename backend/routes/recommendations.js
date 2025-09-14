import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Session, Gift } from '../models/index.js';
import RecommendationEngine from '../services/recommendationEngine.js';

const router = express.Router();
const recommendationEngine = new RecommendationEngine();

/**
 * POST /api/recommendations
 * Get personalized gift recommendations
 */
router.post('/', async (req, res) => {
  try {
    console.log('\n=== NEW RECOMMENDATION REQUEST ===');
    console.log('Raw request body:', JSON.stringify(req.body, null, 2));
    
    const { relationship, occasion, budgetMin, budgetMax, ageRange, interests } = req.body;

    console.log('Extracted values:', {
      relationship: `"${relationship}" (type: ${typeof relationship})`,
      occasion: `"${occasion}" (type: ${typeof occasion})`,
      budgetMin: `${budgetMin} (type: ${typeof budgetMin})`,
      budgetMax: `${budgetMax} (type: ${typeof budgetMax})`,
      ageRange: `"${ageRange}" (type: ${typeof ageRange})`,
      interests: interests + ` (type: ${typeof interests}, isArray: ${Array.isArray(interests)}, length: ${interests?.length})`
    });

    // Validate required fields
    if (!relationship || !occasion || budgetMin === undefined || budgetMax === undefined || !ageRange || !interests) {
      console.log('❌ Validation failed - missing fields');
      const validation = {
        relationship: !!relationship,
        occasion: !!occasion,
        budgetMin: budgetMin !== undefined,
        budgetMax: budgetMax !== undefined,
        ageRange: !!ageRange,
        interests: !!interests
      };
      console.log('Field validation:', validation);
      
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['relationship', 'occasion', 'budgetMin', 'budgetMax', 'ageRange', 'interests'],
        received: validation,
        debug: {
          rawBody: req.body,
          extractedValues: { relationship, occasion, budgetMin, budgetMax, ageRange, interests }
        }
      });
    }

    // Convert budget to numbers
    const numBudgetMin = Number(budgetMin);
    const numBudgetMax = Number(budgetMax);

    console.log('Converted budgets:', { numBudgetMin, numBudgetMax });

    // Validate budget range
    if (isNaN(numBudgetMin) || isNaN(numBudgetMax) || numBudgetMin < 100 || numBudgetMax > 100000 || numBudgetMin > numBudgetMax) {
      console.log('❌ Budget validation failed:', { numBudgetMin, numBudgetMax });
      return res.status(400).json({
        error: 'Invalid budget range. Min: ₹100, Max: ₹100,000, and min must be less than max',
        received: { budgetMin: numBudgetMin, budgetMax: numBudgetMax },
        original: { budgetMin, budgetMax }
      });
    }

    // Validate interests array
    if (!Array.isArray(interests) || interests.length === 0) {
      console.log('❌ Interests validation failed:', { interests, type: typeof interests, isArray: Array.isArray(interests) });
      return res.status(400).json({
        error: 'At least one interest must be selected',
        received: interests,
        debug: { type: typeof interests, isArray: Array.isArray(interests), length: interests?.length }
      });
    }

    const preferences = {
      relationship,
      occasion,
      budgetMin: numBudgetMin,
      budgetMax: numBudgetMax,
      ageRange,
      interests
    };

    console.log('✅ Validated preferences:', preferences);
    console.log('🔍 Calling recommendation engine...');

    // Get recommendations from AI engine
    const recommendations = await recommendationEngine.getRecommendations(preferences);
    console.log(`✅ Got ${recommendations.length} recommendations from engine`);

    // Create session to store preferences and recommendations
    const sessionId = uuidv4();
    const session = new Session({
      sessionId,
      preferences,
      recommendations: recommendations.map(gift => ({
        giftId: gift.giftId,
        name: gift.name,
        price: gift.price,
        reason: gift.reason,
        matchScore: gift.matchScore,
        affiliateLink: gift.affiliateLink
      })),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || ''
    });

    await session.save();
    console.log('💾 Session saved with ID:', sessionId);
    console.log('=== REQUEST COMPLETED ===\n');

    res.json({
      success: true,
      sessionId,
      recommendations,
      message: `Found ${recommendations.length} perfect gifts for your ${relationship}`
    });

  } catch (error) {
    console.error('❌ Recommendations API error:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      error: 'Failed to get recommendations',
      message: error.message,
      debug: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        requestBody: req.body
      } : undefined
    });
  }
});

/**
 * GET /api/recommendations/:sessionId
 * Retrieve saved recommendations by session ID
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'The recommendation session has expired or does not exist'
      });
    }

    res.json({
      success: true,
      sessionId: session.sessionId,
      preferences: session.preferences,
      recommendations: session.recommendations,
      createdAt: session.createdAt
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    
    res.status(500).json({
      error: 'Failed to retrieve recommendations',
      message: error.message
    });
  }
});

/**
 * GET /api/recommendations/debug/status
 * Debug endpoint to check database status
 */
router.get('/debug/status', async (req, res) => {
  try {
    const giftCount = await Gift.countDocuments();
    const sessionCount = await Session.countDocuments();
    
    // Get sample gifts
    const sampleGifts = await Gift.find().limit(3).lean();
    
    res.json({
      success: true,
      database: {
        totalGifts: giftCount,
        totalSessions: sessionCount,
        sampleGifts: sampleGifts.map(g => ({
          name: g.name,
          price: g.price,
          interests: g.interests,
          relationships: g.relationships,
          occasions: g.occasions,
          ageGroups: g.ageGroups
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Debug failed',
      message: error.message
    });
  }
});

export default router;