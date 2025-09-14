import express from 'express';
import RecommendationEngine from '../services/recommendationEngine.js';

const router = express.Router();
const recommendationEngine = new RecommendationEngine();

// Enhanced AI chatbot with intelligent conversation flow
class ChatbotService {
  constructor() {
    this.conversationState = new Map(); // Store conversation context per session
    this.responses = {
      greeting: [
        "Hello! I'm your AI gift assistant 🎁 I'm excited to help you find the perfect gift! Tell me, who are you shopping for today?",
        "Hi there! I'm here to make gift-giving easy and fun! 🎉 What's the occasion, and who's the lucky recipient?",
        "Hey! I'm your personal gift expert! ✨ Whether it's for family, friends, or that special someone, I'll help you find something amazing. Who are we shopping for?"
      ],
      help: [
        "I'm your smart gift recommendation assistant! 🧠 I can help you find personalized gifts by understanding the recipient's personality, interests, and your relationship with them. Just chat with me naturally - tell me about them like you're describing them to a friend!",
        "Think of me as your gift-finding buddy! 👫 I'll ask smart questions to understand who you're shopping for, then suggest perfect gifts that match their personality and your budget. Ready to get started?",
        "I specialize in finding meaningful gifts that create lasting memories! 💝 Share details about the person, and I'll use my knowledge of thousands of gifts to find something they'll absolutely love."
      ],
      budget: [
        "Great question! 💰 I work with all budgets from ₹1,000 to ₹100,000+. What range feels comfortable for you? Remember, the perfect gift isn't about the price - it's about showing you care!",
        "Budget-wise, I'm flexible! 💸 Whether you're looking for something thoughtful under ₹5,000 or want to splurge on something special, I'll find options that give maximum impact. What's your range?",
        "I believe every budget can create magic! ✨ From meaningful gifts under ₹2,000 to luxury finds, I'll help you get the most value. What are you comfortable spending?"
      ],
      interests: [
        "Tell me about their personality! 🎯 Are they adventurous, creative, tech-savvy, fitness-focused? Do they love cooking, reading, gaming, or something else? The more you share, the better I can help!",
        "What makes them tick? 🤔 Think about their hobbies, what they do on weekends, what gets them excited. Are they into sports, art, music, technology, or maybe they're the outdoorsy type?",
        "Paint me a picture of who they are! 🎨 What are they passionate about? What would they choose to do on a perfect free day? This helps me understand their style and preferences."
      ],
      relationship: [
        "Understanding your relationship helps me suggest the perfect tone and type of gift! 👥 Are you shopping for a close friend, family member, romantic partner, colleague, or someone else special?",
        "This is important for getting the right vibe! 💭 Different relationships call for different types of gifts. Are they your bestie, sibling, parent, partner, boss, or someone else?",
        "Knowing your connection helps me match the perfect gift energy! ⚡ Whether it's for someone super close or a thoughtful gesture for an acquaintance, I'll adjust my suggestions accordingly."
      ],
      occasion: [
        "What's the special moment we're celebrating? 🎊 Birthday, anniversary, holiday, graduation, promotion, just because you care, or something else entirely?",
        "Every occasion has its own magic! ✨ Is this for a birthday bash, romantic anniversary, holiday celebration, achievement milestone, or are you surprising them just because?",
        "The occasion sets the perfect tone! 🎭 Whether it's a joyful birthday, meaningful anniversary, festive holiday, proud graduation, or a spontaneous 'thinking of you' moment - I'll match the mood!"
      ],
      encouragement: [
        "You're doing great! 👍 The more details you share, the more personalized my recommendations become.",
        "Perfect! This information helps me understand them better. 🎯",
        "Excellent! I'm getting a clearer picture now. 📸"
      ],
      excitement: [
        "This is exciting! 🎉 I can already think of some great options!",
        "Ooh, I love a good gift challenge! 💪 Let me work my magic.",
        "My gift-radar is buzzing! 📡 I think we're going to find something amazing!"
      ]
    };

    this.keywords = {
      greeting: ['hi', 'hello', 'hey', 'start', 'begin', 'good morning', 'good afternoon', 'good evening'],
      help: ['help', 'assist', 'guide', 'how', 'what can you do', 'what are you', 'explain', 'support'],
      budget: ['budget', 'price', 'cost', 'money', 'expensive', 'cheap', 'affordable', 'rupees', '₹', 'spend', 'range'],
      interests: ['interest', 'hobby', 'like', 'love', 'enjoy', 'passion', 'activity', 'into', 'hobbies', 'passionate', 'obsessed'],
      relationship: ['relationship', 'friend', 'family', 'partner', 'colleague', 'boss', 'wife', 'husband', 'daughter', 'son', 'mother', 'father', 'sister', 'brother', 'girlfriend', 'boyfriend'],
      occasion: ['occasion', 'birthday', 'anniversary', 'holiday', 'christmas', 'wedding', 'graduation', 'celebration', 'festival', 'diwali', 'valentine', 'mothers day', 'fathers day'],
      confirmation: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'right', 'correct', 'exactly'],
      negation: ['no', 'nope', 'not really', 'incorrect', 'wrong', 'different'],
      excitement: ['awesome', 'great', 'amazing', 'perfect', 'wonderful', 'fantastic', 'love it', 'excited'],
      uncertainty: ['maybe', 'not sure', 'don\'t know', 'unsure', 'confused', 'help me', 'suggest']
    };
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    const intents = [];
    
    // Detect multiple intents and their confidence
    for (const [intent, keywords] of Object.entries(this.keywords)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > 0) {
        intents.push({ intent, confidence: matches });
      }
    }
    
    // Sort by confidence and return the most likely intent
    if (intents.length > 0) {
      intents.sort((a, b) => b.confidence - a.confidence);
      return intents[0].intent;
    }
    
    // Check for specific patterns
    if (this.containsPersonInfo(lowerMessage)) return 'person_description';
    if (this.containsGiftRequest(lowerMessage)) return 'gift_request';
    if (this.containsPositiveFeedback(lowerMessage)) return 'positive_feedback';
    
    return 'general';
  }
  
  containsPersonInfo(message) {
    const personDescriptors = ['he', 'she', 'they', 'person', 'guy', 'girl', 'man', 'woman', 'loves', 'enjoys', 'works', 'studies', 'years old', 'age'];
    return personDescriptors.some(desc => message.includes(desc));
  }
  
  containsGiftRequest(message) {
    const giftKeywords = ['suggest', 'recommend', 'find', 'show me', 'what about', 'give me', 'need', 'want', 'looking for', 'ideas'];
    return giftKeywords.some(keyword => message.includes(keyword));
  }
  
  containsPositiveFeedback(message) {
    const positiveWords = ['good', 'nice', 'great', 'perfect', 'awesome', 'love', 'like', 'thanks', 'thank you'];
    return positiveWords.some(word => message.includes(word));
  }

  getRandomResponse(category) {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  extractPreferencesFromMessage(message, context) {
    const lowerMessage = message.toLowerCase();
    const updatedContext = { ...context };

    // Enhanced budget extraction with Indian currency support
    const budgetPatterns = [
      /₹?\s?(\d+(?:,\d+)?(?:\.\d+)?)\s*(?:to|-|and)\s*₹?\s?(\d+(?:,\d+)?(?:\.\d+)?)/i,
      /between\s+₹?\s?(\d+(?:,\d+)?)\s*(?:to|-|and)\s*₹?\s?(\d+(?:,\d+)?)/i,
      /budget.*?₹?\s?(\d+(?:,\d+)?)/i,
      /around\s+₹?\s?(\d+(?:,\d+)?)/i,
      /under\s+₹?\s?(\d+(?:,\d+)?)/i,
      /up\s+to\s+₹?\s?(\d+(?:,\d+)?)/i
    ];

    for (const pattern of budgetPatterns) {
      const match = message.match(pattern);
      if (match) {
        if (match[2]) {
          // Range found
          const min = parseInt(match[1].replace(/,/g, ''));
          const max = parseInt(match[2].replace(/,/g, ''));
          updatedContext.budgetMin = min;
          updatedContext.budgetMax = max;
        } else {
          // Single amount found
          const amount = parseInt(match[1].replace(/,/g, ''));
          if (lowerMessage.includes('under') || lowerMessage.includes('up to')) {
            updatedContext.budgetMin = Math.max(1000, amount - 2000);
            updatedContext.budgetMax = amount;
          } else if (lowerMessage.includes('around') || lowerMessage.includes('about')) {
            updatedContext.budgetMin = Math.max(1000, amount - 1500);
            updatedContext.budgetMax = amount + 1500;
          } else {
            updatedContext.budgetMin = Math.max(1000, amount - 2000);
            updatedContext.budgetMax = amount + 3000;
          }
        }
        break;
      }
    }

    // Enhanced relationship extraction with more patterns
    const relationships = {
      'friend': ['friend', 'buddy', 'pal', 'mate', 'bestie', 'bff', 'close friend'],
      'family': ['family', 'brother', 'sister', 'mom', 'dad', 'mother', 'father', 'parent', 'cousin', 'uncle', 'aunt', 'grandparent', 'grandma', 'grandpa', 'nephew', 'niece'],
      'partner': ['partner', 'boyfriend', 'girlfriend', 'wife', 'husband', 'spouse', 'fiancé', 'fiancée', 'significant other'],
      'colleague': ['colleague', 'coworker', 'boss', 'employee', 'manager', 'team member', 'client', 'business partner']
    };

    for (const [rel, keywords] of Object.entries(relationships)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        updatedContext.relationship = rel;
        break;
      }
    }

    // Enhanced age extraction with more natural patterns
    const agePatterns = {
      'child': ['child', 'kid', 'baby', 'toddler', 'young', '5 year', '6 year', '7 year', '8 year', '9 year', '10 year', '11 year', '12 year'],
      'teen': ['teen', 'teenager', 'adolescent', '13', '14', '15', '16', '17', '18', 'high school'],
      'young-adult': ['young adult', 'college', 'university', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', 'twenties', '20s'],
      'adult': ['adult', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', 'thirties', 'forties', '30s', '40s'],
      'senior': ['senior', 'elderly', '50', '60', '70', '80', 'fifties', 'sixties', 'seventies', 'grandparent', 'grandma', 'grandpa', 'retired']
    };

    for (const [age, keywords] of Object.entries(agePatterns)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        updatedContext.ageRange = age;
        break;
      }
    }

    // Enhanced interest extraction with categories and subcategories
    const interestCategories = {
      'technology': ['tech', 'technology', 'computer', 'gadget', 'phone', 'electronic', 'gaming', 'games', 'pc', 'laptop', 'software', 'ai', 'coding', 'programming'],
      'sports': ['sport', 'sports', 'fitness', 'gym', 'workout', 'athletic', 'football', 'cricket', 'tennis', 'basketball', 'swimming', 'running', 'yoga'],
      'books': ['book', 'books', 'reading', 'literature', 'novel', 'author', 'writing', 'library'],
      'music': ['music', 'musical', 'instrument', 'song', 'band', 'concert', 'singing', 'guitar', 'piano', 'drums'],
      'art': ['art', 'artistic', 'painting', 'drawing', 'creative', 'craft', 'crafts', 'pottery', 'sculpture', 'design'],
      'cooking': ['cooking', 'cook', 'chef', 'kitchen', 'food', 'recipe', 'baking', 'culinary', 'foodie'],
      'travel': ['travel', 'traveling', 'trip', 'vacation', 'adventure', 'explore', 'wanderlust'],
      'fashion': ['fashion', 'style', 'clothes', 'clothing', 'outfit', 'trendy', 'designer'],
      'photography': ['photo', 'photography', 'camera', 'pictures', 'instagram'],
      'gardening': ['garden', 'gardening', 'plants', 'flowers', 'green thumb'],
      'pets': ['pet', 'pets', 'dog', 'cat', 'animal', 'animals']
    };

    const detectedInterests = [];
    for (const [interest, keywords] of Object.entries(interestCategories)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedInterests.push(interest);
      }
    }

    if (detectedInterests.length > 0) {
      updatedContext.interests = [...new Set([...updatedContext.interests, ...detectedInterests])];
    }

    // Extract occasions with more patterns
    const occasions = {
      'birthday': ['birthday', 'bday', 'born', 'birth'],
      'anniversary': ['anniversary', 'years together', 'dating anniversary'],
      'holiday': ['holiday', 'christmas', 'diwali', 'eid', 'holi', 'festival'],
      'graduation': ['graduation', 'graduated', 'degree', 'college', 'university'],
      'wedding': ['wedding', 'marriage', 'married', 'bride', 'groom'],
      'just-because': ['just because', 'surprise', 'thinking of', 'no reason', 'love']
    };

    for (const [occasion, keywords] of Object.entries(occasions)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        updatedContext.occasion = occasion;
        break;
      }
    }

    return updatedContext;
  }

  async generateResponse(message, context, sessionId = 'default') {
    const intent = this.detectIntent(message);
    const updatedContext = this.extractPreferencesFromMessage(message, context);
    
    // Store conversation state
    if (!this.conversationState.has(sessionId)) {
      this.conversationState.set(sessionId, {
        messageCount: 0,
        gatheredInfo: [],
        lastIntent: null,
        conversationFlow: 'initial'
      });
    }
    
    const conversationData = this.conversationState.get(sessionId);
    conversationData.messageCount++;
    conversationData.lastIntent = intent;
    
    let response = '';
    let suggestions = null;
    let quickActions = [];

    // Determine conversation flow stage
    const infoCompleteness = this.assessInformationCompleteness(updatedContext);
    
    // Generate intelligent responses based on intent and context
    switch (intent) {
      case 'greeting':
        response = this.getRandomResponse('greeting');
        quickActions = ['Tell me about them', 'Set budget first', 'Browse categories'];
        conversationData.conversationFlow = 'greeting_sent';
        break;
        
      case 'help':
        response = this.getRandomResponse('help');
        quickActions = ['Start gift search', 'Explain how you work', 'Show examples'];
        break;
        
      case 'budget':
        if (updatedContext.budgetMin && updatedContext.budgetMax) {
          response = `Perfect! Budget of ₹${updatedContext.budgetMin.toLocaleString()} to ₹${updatedContext.budgetMax.toLocaleString()} noted! 💰 ${this.getRandomResponse('encouragement')} Now, tell me about their personality and interests!`;
        } else {
          response = this.getRandomResponse('budget');
        }
        quickActions = ['₹1,000-5,000', '₹5,000-15,000', '₹15,000+'];
        break;
        
      case 'interests':
        if (updatedContext.interests.length > 0) {
          response = `Great! I see they're into ${updatedContext.interests.join(', ')}! 🎯 ${this.getRandomResponse('encouragement')} This gives me a good starting point.`;
        } else {
          response = this.getRandomResponse('interests');
        }
        quickActions = ['Technology', 'Sports & Fitness', 'Arts & Crafts', 'Books & Learning'];
        break;
        
      case 'relationship':
        if (updatedContext.relationship) {
          response = `Got it! Shopping for a ${updatedContext.relationship}. 👥 ${this.getRandomResponse('encouragement')} The relationship context helps me suggest the right type of gift.`;
        } else {
          response = this.getRandomResponse('relationship');
        }
        quickActions = ['Close Friend', 'Family Member', 'Romantic Partner', 'Colleague'];
        break;
        
      case 'occasion':
        if (updatedContext.occasion) {
          response = `Perfect! A ${updatedContext.occasion} gift! 🎉 ${this.getRandomResponse('encouragement')} That helps set the right tone for my recommendations.`;
        } else {
          response = this.getRandomResponse('occasion');
        }
        quickActions = ['Birthday', 'Anniversary', 'Holiday', 'Just Because'];
        break;
        
      case 'person_description':
        response = `That's helpful information! 📝 I'm building a picture of who they are. ${this.getRandomResponse('encouragement')}`;
        conversationData.gatheredInfo.push('person_description');
        break;
        
      case 'gift_request':
        if (infoCompleteness.canRecommend) {
          try {
            const preferences = this.buildPreferencesForRecommendation(updatedContext);
            const recommendations = await recommendationEngine.getRecommendations(preferences);
            
            if (recommendations && recommendations.length > 0) {
              response = this.generateRecommendationResponse(recommendations, updatedContext);
              suggestions = recommendations.slice(0, 3);
            } else {
              response = "I'm having trouble finding specific recommendations right now. Let me gather a bit more information to give you better suggestions!";
            }
          } catch (error) {
            console.error('Recommendation error:', error);
            response = "I'm experiencing some technical difficulties. Let me ask you a few questions to help manually suggest some great options!";
          }
        } else {
          response = this.generateInfoGatheringResponse(updatedContext, infoCompleteness);
        }
        break;
        
      case 'positive_feedback':
        response = `Thank you! 😊 ${this.getRandomResponse('excitement')} ${this.generateFollowUpQuestion(updatedContext, infoCompleteness)}`;
        break;
        
      case 'confirmation':
        response = `Excellent! 👍 ${this.generateNextStepResponse(updatedContext, infoCompleteness)}`;
        break;
        
      case 'uncertainty':
        response = `No worries! 🙌 I'm here to help you figure it out. ${this.generateGuidanceResponse(updatedContext)}`;
        break;
        
      default:
        if (infoCompleteness.canRecommend && conversationData.messageCount > 2) {
          // User provided enough info, try to recommend
          try {
            const preferences = this.buildPreferencesForRecommendation(updatedContext);
            const recommendations = await recommendationEngine.getRecommendations(preferences);
            
            if (recommendations && recommendations.length > 0) {
              response = `Based on everything you've told me, here are some perfect gift ideas! 🎁`;
              suggestions = recommendations.slice(0, 3);
            } else {
              response = this.generateInfoGatheringResponse(updatedContext, infoCompleteness);
            }
          } catch (error) {
            response = this.generateInfoGatheringResponse(updatedContext, infoCompleteness);
          }
        } else {
          response = this.generateInfoGatheringResponse(updatedContext, infoCompleteness);
        }
    }

    // Update conversation state
    this.conversationState.set(sessionId, conversationData);

    return { response, updatedContext, suggestions, quickActions };
  }
  
  assessInformationCompleteness(context) {
    const completeness = {
      hasRelationship: !!context.relationship,
      hasBudget: !!(context.budgetMin && context.budgetMax),
      hasInterests: context.interests && context.interests.length > 0,
      hasAgeRange: !!context.ageRange,
      hasOccasion: !!context.occasion
    };
    
    const totalFields = Object.keys(completeness).length;
    const completedFields = Object.values(completeness).filter(Boolean).length;
    const completionPercentage = (completedFields / totalFields) * 100;
    
    return {
      ...completeness,
      completionPercentage,
      canRecommend: completedFields >= 2, // Need at least 2 pieces of info
      isComplete: completedFields >= 4 // Most fields filled
    };
  }
  
  buildPreferencesForRecommendation(context) {
    // Enhanced preference building with intelligent defaults
    const preferences = {
      relationship: context.relationship || 'friend',
      occasion: context.occasion || 'birthday',
      budgetMin: context.budgetMin || 1000,
      budgetMax: context.budgetMax || 10000,
      ageRange: context.ageRange || 'adult',
      interests: context.interests.length > 0 ? context.interests : ['technology']
    };
    
    // Apply currency conversion for Indian Rupees (1 USD = 83 INR)
    preferences.budgetMin = Math.round(preferences.budgetMin);
    preferences.budgetMax = Math.round(preferences.budgetMax);
    
    // Ensure budget is within reasonable range
    if (preferences.budgetMin < 100) preferences.budgetMin = 1000;
    if (preferences.budgetMax > 100000) preferences.budgetMax = 50000;
    if (preferences.budgetMin >= preferences.budgetMax) {
      preferences.budgetMax = preferences.budgetMin + 2000;
    }
    
    return preferences;
  }
  
  generateRecommendationResponse(recommendations, context) {
    const personalizedResponses = {
      friend: [
        `🎉 Perfect! I found some amazing gifts for your friend! These thoughtful picks will definitely make them smile:`,
        `✨ Fantastic! Based on your friendship, here are some wonderful gift ideas that show you really know them:`,
        `😊 Great choices ahead! These gifts are perfect for strengthening your friendship:`
      ],
      family: [
        `💝 Beautiful! I've found some heartwarming gifts perfect for your family member:`,
        `🏠 Wonderful! These family-focused gifts will show how much you care:`,
        `❤️ Perfect family gifts coming up! These will create lasting memories:`
      ],
      partner: [
        `💕 Amazing! These romantic and thoughtful gifts are perfect for your special someone:`,
        `🌹 I found some beautiful gifts that will make your partner's heart flutter:`,
        `😍 Wonderful choices for your loved one! These gifts show your deep affection:`
      ],
      colleague: [
        `💼 Excellent! These professional yet thoughtful gifts are perfect for your colleague:`,
        `🤝 Great workplace-appropriate gifts that show appreciation:`,
        `🎆 Perfect professional picks! These gifts strike the right balance:`
      ]
    };
    
    const relationshipResponses = personalizedResponses[context.relationship] || personalizedResponses.friend;
    let baseResponse = relationshipResponses[Math.floor(Math.random() * relationshipResponses.length)];
    
    // Add budget context if available
    if (context.budgetMin && context.budgetMax) {
      baseResponse += ` Within your ₹${context.budgetMin.toLocaleString()}-₹${context.budgetMax.toLocaleString()} budget, here's what I recommend:`;
    }
    
    return baseResponse;
  }
  
  generateInfoGatheringResponse(context, completeness) {
    const missingInfo = [];
    
    if (!completeness.hasRelationship) missingInfo.push('your relationship with them');
    if (!completeness.hasInterests) missingInfo.push('their interests and hobbies');
    if (!completeness.hasBudget) missingInfo.push('your budget range');
    if (!completeness.hasAgeRange) missingInfo.push('their age range');
    if (!completeness.hasOccasion) missingInfo.push('the occasion');
    
    if (missingInfo.length === 0) {
      return "You've given me great information! Let me suggest some perfect gifts based on what you've shared. 🎁";
    }
    
    const responses = [
      `I'm getting a good picture! To find the most perfect gifts, could you tell me about ${missingInfo[0]}? 🤔`,
      `Great start! To personalize my recommendations even more, I'd love to know about ${missingInfo[0]}. 🎯`,
      `Perfect! You're helping me understand them better. What about ${missingInfo[0]}? 💡`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  generateFollowUpQuestion(context, completeness) {
    if (!completeness.hasInterests) {
      return "What are some things they're passionate about or enjoy doing in their free time?";
    }
    if (!completeness.hasBudget) {
      return "What budget range are you thinking for this gift?";
    }
    if (!completeness.hasRelationship) {
      return "What's your relationship with them?";
    }
    if (!completeness.hasOccasion) {
      return "What's the special occasion we're celebrating?";
    }
    
    return "Would you like me to find some personalized gift recommendations now?";
  }
  
  generateNextStepResponse(context, completeness) {
    if (completeness.canRecommend) {
      return "I think I have enough information to suggest some amazing gifts! Would you like to see my recommendations?";
    } else {
      return this.generateInfoGatheringResponse(context, completeness);
    }
  }
  
  generateGuidanceResponse(context) {
    const guidance = [
      "Let's start simple - tell me about the person you're shopping for. What do they enjoy doing?",
      "No problem! How about we begin with who this gift is for? A friend, family member, or someone special?",
      "That's totally fine! Let's take it step by step. What's the occasion you're shopping for?",
      "Don't worry! I'll guide you through it. First, what's your relationship with the person you're buying for?"
    ];
    
    return guidance[Math.floor(Math.random() * guidance.length)];
  }
}

const chatbotService = new ChatbotService();

// POST /api/chatbot - Handle chatbot messages with enhanced intelligence
router.post('/', async (req, res) => {
  try {
    const { message, context, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a string'
      });
    }

    // Generate intelligent response with session tracking
    const { response, updatedContext, suggestions, quickActions } = await chatbotService.generateResponse(
      message, 
      context || {}, 
      sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );

    res.json({
      success: true,
      message: response,
      context: updatedContext,
      suggestions: suggestions,
      quickActions: quickActions || [],
      sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'I\'m having some technical difficulties. Please try again or use the main recommendation form.',
      suggestions: null,
      quickActions: ['Try main form', 'Start over']
    });
  }
});

export default router;