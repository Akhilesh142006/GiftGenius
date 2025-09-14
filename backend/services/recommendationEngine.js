import { Gift } from '../models/index.js';

/**
 * AI Recommendation Engine
 * Uses hybrid approach combining content-based filtering and rule-based scoring
 */
class RecommendationEngine {
  constructor() {
    this.weights = {
      interestMatch: 0.35,
      priceMatch: 0.25,
      popularityScore: 0.20,
      rating: 0.15,
      occasionMatch: 0.05
    };
  }

  /**
   * Get personalized gift recommendations
   */
  async getRecommendations(preferences) {
    const {
      relationship,
      occasion,
      budgetMin,
      budgetMax,
      ageRange,
      interests
    } = preferences;

    try {
      // Build the query filter
      const filter = this.buildFilter(preferences);
      
      console.log('Filter used for query:', JSON.stringify(filter, null, 2));
      
      // Get potential gifts from database
      let potentialGifts = await Gift.find(filter).lean();
      
      console.log(`Found ${potentialGifts.length} gifts with initial filter`);
      
      // If no gifts found, try a more relaxed filter
      if (potentialGifts.length === 0) {
        console.log('No gifts found with strict filter, trying relaxed filter...');
        
        const relaxedFilter = {
          price: { $gte: budgetMin, $lte: budgetMax },
          $or: [
            { isEmergencyGift: { $exists: false } },
            { isEmergencyGift: false },
            { isEmergencyGift: null }
          ]
        };
        
        // Add interest filter only if provided
        if (interests && interests.length > 0) {
          relaxedFilter.interests = { $in: interests };
        }
        
        potentialGifts = await Gift.find(relaxedFilter).lean();
        console.log(`Found ${potentialGifts.length} gifts with relaxed filter`);
      }
      
      // If still no gifts, get any gifts in budget range
      if (potentialGifts.length === 0) {
        console.log('No gifts found with relaxed filter, trying budget-only filter...');
        
        const budgetOnlyFilter = {
          price: { $gte: budgetMin, $lte: budgetMax },
          $or: [
            { isEmergencyGift: { $exists: false } },
            { isEmergencyGift: false },
            { isEmergencyGift: null }
          ]
        };
        
        potentialGifts = await Gift.find(budgetOnlyFilter).lean();
        console.log(`Found ${potentialGifts.length} gifts with budget-only filter`);
      }
      
      // If STILL no gifts, get ANY non-emergency gifts (ignore budget)
      if (potentialGifts.length === 0) {
        console.log('No gifts found with budget filter, getting ANY gifts...');
        
        const anyFilter = {
          $or: [
            { isEmergencyGift: { $exists: false } },
            { isEmergencyGift: false },
            { isEmergencyGift: null }
          ]
        };
        
        potentialGifts = await Gift.find(anyFilter).limit(10).lean();
        console.log(`Found ${potentialGifts.length} gifts with ANY filter`);
      }
      
      if (potentialGifts.length === 0) {
        throw new Error('No gifts found in your budget range. Please try adjusting your budget or check if the database has been seeded with gift data.');
      }

      // Score and rank gifts
      const scoredGifts = potentialGifts.map(gift => ({
        ...gift,
        matchScore: this.calculateMatchScore(gift, preferences),
        reason: this.generateReason(gift, preferences)
      }));

      // Sort by match score and return top 3
      const topGifts = scoredGifts
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

      console.log(`Returning ${topGifts.length} top recommendations`);
      return topGifts.map(gift => this.formatGiftResponse(gift));
      
    } catch (error) {
      console.error('Recommendation engine error:', error);
      throw error;
    }
  }

  /**
   * Get emergency gifts (instant delivery)
   */
  async getEmergencyGifts(budget, interests) {
    try {
      const filter = {
        isEmergencyGift: true,
        price: { $gte: budget.min, $lte: budget.max }
      };

      // Add interest filter if provided
      if (interests && interests.length > 0) {
        filter.interests = { $in: interests };
      }

      const emergencyGifts = await Gift.find(filter)
        .sort({ popularityScore: -1, rating: -1 })
        .limit(5)
        .lean();

      return emergencyGifts.map(gift => this.formatEmergencyGiftResponse(gift));
      
    } catch (error) {
      console.error('Emergency gifts error:', error);
      throw error;
    }
  }

  /**
   * Build MongoDB filter based on preferences
   */
  buildFilter(preferences) {
    const { relationship, occasion, budgetMin, budgetMax, ageRange, interests } = preferences;

    // Start with basic filters that are non-negotiable
    const filter = {
      // Price range filter
      price: { $gte: budgetMin, $lte: budgetMax },
      
      // Exclude emergency gifts from regular recommendations
      $or: [
        { isEmergencyGift: { $exists: false } },
        { isEmergencyGift: false },
        { isEmergencyGift: null }
      ]
    };

    // Build optional matching criteria with OR logic for flexibility
    const matchingCriteria = [];
    
    // Interest matching (most important)
    if (interests && interests.length > 0) {
      matchingCriteria.push({ interests: { $in: interests } });
    }
    
    // Relationship matching
    if (relationship) {
      matchingCriteria.push({ relationships: relationship });
    }
    
    // Age group matching
    if (ageRange) {
      matchingCriteria.push({ ageGroups: ageRange });
    }
    
    // Occasion matching
    if (occasion) {
      matchingCriteria.push({ occasions: occasion });
    }

    // If we have matching criteria, require at least one match
    if (matchingCriteria.length > 0) {
      filter.$and = [
        { $or: matchingCriteria }
      ];
    }

    return filter;
  }

  /**
   * Calculate match score for a gift
   */
  calculateMatchScore(gift, preferences) {
    let score = 0;
    const { interests, budgetMin, budgetMax, occasion } = preferences;

    // Interest matching score (0-100)
    const interestScore = this.calculateInterestScore(gift.interests, interests);
    score += interestScore * this.weights.interestMatch;

    // Price matching score (0-100)
    const priceScore = this.calculatePriceScore(gift.price, budgetMin, budgetMax);
    score += priceScore * this.weights.priceMatch;

    // Popularity score (already 0-100)
    score += gift.popularityScore * this.weights.popularityScore;

    // Rating score (convert 1-5 to 0-100)
    const ratingScore = ((gift.rating - 1) / 4) * 100;
    score += ratingScore * this.weights.rating;

    // Occasion bonus
    const occasionScore = gift.occasions.includes(occasion) ? 100 : 0;
    score += occasionScore * this.weights.occasionMatch;

    return Math.round(score);
  }

  /**
   * Calculate interest matching score
   */
  calculateInterestScore(giftInterests, userInterests) {
    if (!userInterests || userInterests.length === 0) return 50;
    if (!giftInterests || giftInterests.length === 0) return 30;

    const matchingInterests = giftInterests.filter(interest => 
      userInterests.includes(interest)
    );

    const matchRatio = matchingInterests.length / userInterests.length;
    return Math.min(100, matchRatio * 100 + 20); // Bonus for any match
  }

  /**
   * Calculate price matching score
   */
  calculatePriceScore(giftPrice, budgetMin, budgetMax) {
    const budgetMidpoint = (budgetMin + budgetMax) / 2;
    const budgetRange = budgetMax - budgetMin;

    if (budgetRange === 0) return 100;

    const distance = Math.abs(giftPrice - budgetMidpoint);
    const normalizedDistance = distance / (budgetRange / 2);

    return Math.max(0, 100 - (normalizedDistance * 50));
  }

  /**
   * Generate explanation for why gift was recommended
   */
  generateReason(gift, preferences) {
    const reasons = [];
    
    // Interest-based reasons
    const matchingInterests = gift.interests.filter(interest => 
      preferences.interests.includes(interest)
    );
    
    if (matchingInterests.length > 0) {
      const interestText = matchingInterests.length === 1 
        ? matchingInterests[0] 
        : `${matchingInterests.slice(0, -1).join(', ')} and ${matchingInterests.slice(-1)}`;
      reasons.push(`Matches their love for ${interestText}`);
    }

    // Price-based reasons
    const budgetMidpoint = (preferences.budgetMin + preferences.budgetMax) / 2;
    if (Math.abs(gift.price - budgetMidpoint) <= (preferences.budgetMax - preferences.budgetMin) * 0.2) {
      reasons.push(`Perfect fit for your budget`);
    }

    // Popularity reasons
    if (gift.popularityScore >= 80) {
      reasons.push(`Highly popular choice`);
    }

    // Rating reasons
    if (gift.rating >= 4.5) {
      reasons.push(`Excellent customer reviews`);
    }

    // Occasion reasons
    if (gift.occasions.includes(preferences.occasion)) {
      reasons.push(`Great for ${preferences.occasion} occasions`);
    }

    // Default reason if no specific matches
    if (reasons.length === 0) {
      reasons.push(`Carefully selected for your ${preferences.relationship}`);
    }

    return reasons[0]; // Return the most relevant reason
  }

  /**
   * Format gift for API response
   */
  formatGiftResponse(gift) {
    return {
      giftId: gift.giftId,
      name: gift.name,
      price: gift.price,
      description: gift.description,
      imageUrl: gift.imageUrl,
      affiliateLink: gift.affiliateLink,
      matchScore: gift.matchScore,
      reason: gift.reason,
      rating: gift.rating,
      brand: gift.brand
    };
  }

  /**
   * Format emergency gift for API response
   */
  formatEmergencyGiftResponse(gift) {
    return {
      giftId: gift.giftId,
      name: gift.name,
      price: gift.price,
      description: gift.description,
      affiliateLink: gift.affiliateLink,
      rating: gift.rating,
      brand: gift.brand,
      deliveryTime: 'Instant digital delivery'
    };
  }
}

export default RecommendationEngine;