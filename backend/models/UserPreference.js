import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  preferences: {
    favoriteCategories: [{
      type: String,
      enum: [
        'technology', 'books', 'fitness', 'art', 'music', 'cooking',
        'gaming', 'fashion', 'home', 'beauty', 'sports', 'travel'
      ]
    }],
    priceRange: {
      min: {
        type: Number,
        default: 10
      },
      max: {
        type: Number,
        default: 200
      }
    },
    interests: [{
      type: String,
      enum: ['technology', 'books', 'fitness', 'art', 'music', 'cooking', 'gaming', 'fashion']
    }]
  },
  giftHistory: [{
    sessionId: String,
    giftIds: [String],
    occasion: String,
    relationship: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    saveHistory: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
userPreferenceSchema.index({ userId: 1 });
userPreferenceSchema.index({ email: 1 });

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

export default UserPreference;