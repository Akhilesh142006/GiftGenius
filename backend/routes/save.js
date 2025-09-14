import express from 'express';
import { Session } from '../models/index.js';

const router = express.Router();

/**
 * POST /api/save-recommendations
 * Save recommendations to user session for later retrieval
 */
router.post('/', async (req, res) => {
  try {
    const { sessionId, recommendations } = req.body;

    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({
        error: 'Session ID is required'
      });
    }

    if (!recommendations || !Array.isArray(recommendations)) {
      return res.status(400).json({
        error: 'Recommendations array is required'
      });
    }

    // Find the session
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'The session has expired or does not exist'
      });
    }

    // Update the session with new recommendations if provided
    if (recommendations.length > 0) {
      session.recommendations = recommendations.map(rec => ({
        giftId: rec.giftId,
        name: rec.name,
        price: rec.price,
        reason: rec.reason || '',
        matchScore: rec.matchScore || 0,
        affiliateLink: rec.affiliateLink
      }));
    }

    // Mark as saved and update timestamp
    session.updatedAt = new Date();
    await session.save();

    console.log(`Saved recommendations for session: ${sessionId}`);

    res.json({
      success: true,
      sessionId,
      message: 'Recommendations saved successfully',
      savedCount: session.recommendations.length,
      expiresAt: new Date(session.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from creation
      retrievalUrl: `/api/recommendations/${sessionId}`
    });

  } catch (error) {
    console.error('Save recommendations error:', error);
    
    res.status(500).json({
      error: 'Failed to save recommendations',
      message: error.message
    });
  }
});

/**
 * DELETE /api/save-recommendations/:sessionId
 * Delete saved recommendations
 */
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'The session has already been deleted or does not exist'
      });
    }

    await Session.deleteOne({ sessionId });

    console.log(`Deleted session: ${sessionId}`);

    res.json({
      success: true,
      message: 'Recommendations deleted successfully',
      sessionId
    });

  } catch (error) {
    console.error('Delete recommendations error:', error);
    
    res.status(500).json({
      error: 'Failed to delete recommendations',
      message: error.message
    });
  }
});

/**
 * GET /api/save-recommendations/stats
 * Get statistics about saved sessions
 */
router.get('/stats', async (req, res) => {
  try {
    const totalSessions = await Session.countDocuments();
    const sessionsWithEmail = await Session.countDocuments({ emailSent: true });
    
    // Get sessions created in the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSessions = await Session.countDocuments({ 
      createdAt: { $gte: yesterday } 
    });

    // Get popular preferences
    const popularRelationships = await Session.aggregate([
      { $group: { _id: '$preferences.relationship', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const popularOccasions = await Session.aggregate([
      { $group: { _id: '$preferences.occasion', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      statistics: {
        totalSessions,
        sessionsWithEmail,
        recentSessions,
        emailRate: totalSessions > 0 ? ((sessionsWithEmail / totalSessions) * 100).toFixed(1) : 0,
        popularRelationships: popularRelationships.map(item => ({
          relationship: item._id,
          count: item.count
        })),
        popularOccasions: popularOccasions.map(item => ({
          occasion: item._id,
          count: item.count
        }))
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    
    res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message
    });
  }
});

export default router;