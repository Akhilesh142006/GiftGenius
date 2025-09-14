import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  preferences: {
    relationship: {
      type: String,
      required: true,
      enum: ['family', 'friend', 'colleague', 'partner']
    },
    occasion: {
      type: String,
      required: true,
      enum: ['birthday', 'holiday', 'anniversary', 'thank-you', 'just-because']
    },
    budgetMin: {
      type: Number,
      required: true,
      min: 100
    },
    budgetMax: {
      type: Number,
      required: true,
      max: 100000
    },
    ageRange: {
      type: String,
      required: true,
      enum: ['under-18', '18-30', '30-45', '45+']
    },
    interests: [{
      type: String,
      enum: ['technology', 'books', 'fitness', 'art', 'music', 'cooking', 'gaming', 'fashion']
    }]
  },
  recommendations: [{
    giftId: {
      type: String,
      required: true
    },
    name: String,
    price: Number,
    reason: String,
    matchScore: Number,
    affiliateLink: String
  }],
  emergencyGifts: [{
    giftId: String,
    name: String,
    price: Number,
    affiliateLink: String
  }],
  emailSent: {
    type: Boolean,
    default: false
  },
  emailAddress: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
sessionSchema.index({ sessionId: 1 });
sessionSchema.index({ createdAt: 1 });

// Auto-expire sessions after 7 days
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;