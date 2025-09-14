import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema({
  giftId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'technology', 'books', 'fitness', 'art', 'music', 'cooking', 
      'gaming', 'fashion', 'home', 'beauty', 'sports', 'travel',
      'digital', 'experience', 'subscription'
    ]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=Gift'
  },
  affiliateLink: {
    type: String,
    required: true
  },
  interests: [{
    type: String,
    enum: [
      'technology', 'books', 'fitness', 'art', 'music', 
      'cooking', 'gaming', 'fashion'
    ]
  }],
  occasions: [{
    type: String,
    enum: ['birthday', 'holiday', 'anniversary', 'thank-you', 'just-because']
  }],
  ageGroups: [{
    type: String,
    enum: ['under-18', '18-30', '30-45', '45+']
  }],
  relationships: [{
    type: String,
    enum: ['family', 'friend', 'colleague', 'partner']
  }],
  popularityScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 1,
    max: 5
  },
  isEmergencyGift: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
giftSchema.index({ category: 1, price: 1 });
giftSchema.index({ interests: 1 });
giftSchema.index({ occasions: 1 });
giftSchema.index({ ageGroups: 1 });
giftSchema.index({ relationships: 1 });
giftSchema.index({ isEmergencyGift: 1 });
giftSchema.index({ popularityScore: -1 });
giftSchema.index({ rating: -1 });

const Gift = mongoose.model('Gift', giftSchema);

export default Gift;