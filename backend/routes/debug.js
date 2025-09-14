import express from 'express';
import { Gift, Session } from '../models/index.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * GET /api/debug/health
 * System health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Get database stats
    const giftCount = await Gift.countDocuments();
    const sessionCount = await Session.countDocuments();
    
    // Get gift price range
    const gifts = await Gift.find({}, 'price').lean();
    const prices = gifts.map(g => g.price);
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices),
      count: prices.length
    } : null;

    // Get sample gifts for verification
    const sampleGifts = await Gift.find().limit(5).lean();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
      },
      database: {
        status: dbStatusText[dbStatus] || 'unknown',
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        collections: {
          gifts: giftCount,
          sessions: sessionCount
        }
      },
      gifts: {
        totalCount: giftCount,
        priceRange: priceRange,
        sampleGifts: sampleGifts.map(g => ({
          id: g.giftId,
          name: g.name,
          price: g.price,
          category: g.category,
          interests: g.interests,
          isEmergencyGift: g.isEmergencyGift
        }))
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/debug/test-recommendations
 * Test recommendation engine with sample data
 */
router.post('/test-recommendations', async (req, res) => {
  try {
    const RecommendationEngine = (await import('../services/recommendationEngine.js')).default;
    const engine = new RecommendationEngine();

    const testPreferences = req.body.preferences || {
      relationship: 'friend',
      occasion: 'birthday',
      budgetMin: 1000,
      budgetMax: 10000,
      ageRange: '18-30',
      interests: ['technology', 'music']
    };

    console.log('Testing with preferences:', testPreferences);

    const recommendations = await engine.getRecommendations(testPreferences);

    res.json({
      success: true,
      testPreferences,
      recommendationsCount: recommendations.length,
      recommendations: recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/debug/config
 * Get current configuration status
 */
router.get('/config', (req, res) => {
  res.json({
    success: true,
    config: {
      mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '5000',
      frontendUrl: process.env.FRONTEND_URL || 'Not set',
      emailService: process.env.EMAIL_SERVICE || 'Not set',
      emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set'
    },
    currency: {
      system: 'INR',
      budgetRange: '₹100 - ₹100,000',
      step: '₹500'
    },
    recommendations: {
      maxResults: 3,
      fallbackEnabled: true,
      emergencyGiftsEnabled: true
    },
    timestamp: new Date().toISOString()
  });
});

export default router;