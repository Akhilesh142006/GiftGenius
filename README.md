# 🎁 GiftGenius - AI Gift Recommendation System

GiftGenius is a full-stack AI-powered gift recommendation web application that helps users find personalized gift suggestions by answering simple questions about the gift recipient. The system analyzes personality, preferences, and contextual data to generate instant top 3 gift recommendations with reasoning.

## ✨ Features

### Frontend Features
- **Clean, Modern UI**: Mobile-first design with blue (#4A90E2) primary and green (#7ED321) accent colors
- **Progressive Onboarding**: 3-step wizard with progress indicators
- **Smart Questionnaire**: Relationship, occasion, budget, age range, and interests selection
- **AI-Powered Results**: Top 3 personalized recommendations with match percentages and explanations
- **Emergency Gift Mode**: Instant digital gifts for last-minute needs
- **Email Integration**: Save and email recommendations
- **Responsive Design**: Optimized for mobile and desktop

### Backend Features
- **AI Recommendation Engine**: Hybrid content-based and rule-based filtering
- **MongoDB Database**: 50+ diverse gift items with rich metadata
- **RESTful APIs**: Complete API for recommendations, emergency gifts, saving, and emailing
- **Session Management**: Track user preferences and recommendations
- **Email Service**: Beautifully formatted recommendation emails
- **Rate Limiting & Security**: Production-ready with Helmet and CORS

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Email service (Gmail or SMTP)

### Installation

1. **Clone and Setup**
```bash
# Navigate to the project directory
cd giftgenius

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. **Configure Environment**
```bash
# In backend directory, copy and configure environment
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/giftgenius
FRONTEND_URL=http://localhost:3000

# Gmail configuration (recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Or SMTP configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

3. **Setup Database**
```bash
# In backend directory, seed the database with gift items
npm run seed
```

4. **Start the Application**
```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Start frontend development server
cd frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📁 Project Structure

```
giftgenius/
├── backend/                    # Node.js/Express API server
│   ├── models/                 # MongoDB models
│   │   ├── Gift.js            # Gift item schema
│   │   ├── Session.js         # User session schema
│   │   └── UserPreference.js  # User preferences schema
│   ├── routes/                # API route handlers
│   │   ├── recommendations.js # Main recommendation API
│   │   ├── emergency.js       # Emergency gifts API
│   │   ├── save.js           # Save recommendations API
│   │   └── email.js          # Email sending API
│   ├── services/              # Business logic services
│   │   └── recommendationEngine.js # AI recommendation algorithm
│   ├── scripts/               # Database utilities
│   │   └── seedDatabase.js    # Database seeding script
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment template
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header.jsx     # App header
│   │   │   ├── Welcome.jsx    # Welcome screen
│   │   │   ├── RelationshipOccasion.jsx # Step 1
│   │   │   ├── BudgetAge.jsx  # Step 2
│   │   │   ├── Interests.jsx  # Step 3
│   │   │   ├── Loading.jsx    # AI processing screen
│   │   │   └── Results.jsx    # Results display
│   │   ├── context/           # React context
│   │   │   └── GiftContext.jsx # Global state management
│   │   ├── services/          # API services
│   │   │   └── api.js         # Backend API client
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
└── README.md                 # This file
```

## 🔧 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get Recommendations
```http
POST /recommendations
Content-Type: application/json

{
  "relationship": "friend",
  "occasion": "birthday", 
  "budgetMin": 25,
  "budgetMax": 100,
  "ageRange": "18-30",
  "interests": ["technology", "music"]
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-here",
  "recommendations": [
    {
      "giftId": "tech_001",
      "name": "Wireless Bluetooth Headphones",
      "price": 89,
      "description": "Premium noise-cancelling wireless headphones",
      "affiliateLink": "https://amazon.com/headphones",
      "matchScore": 92,
      "reason": "Matches their love for technology and music",
      "rating": 4.5,
      "brand": "TechSound"
    }
  ]
}
```

#### 2. Emergency Gifts
```http
POST /emergency
Content-Type: application/json

{
  "budget": { "min": 25, "max": 100 },
  "interests": ["technology", "music"]
}
```

#### 3. Save Recommendations
```http
POST /save-recommendations
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "recommendations": [...]
}
```

#### 4. Email Recommendations
```http
POST /email-recommendations
Content-Type: application/json

{
  "email": "user@example.com",
  "recommendations": [...],
  "preferences": {...},
  "sessionId": "uuid-here"
}
```

## 🤖 AI Recommendation Algorithm

The recommendation engine uses a hybrid approach:

### 1. Content-Based Filtering
- **Interest Matching**: Compares user interests with gift categories
- **Price Optimization**: Finds gifts close to budget midpoint
- **Demographic Targeting**: Matches age group and relationship

### 2. Rule-Based Scoring
- **Interest Match**: 35% weight
- **Price Match**: 25% weight  
- **Popularity Score**: 20% weight
- **Rating Score**: 15% weight
- **Occasion Match**: 5% weight

### 3. Personalized Explanations
Each recommendation includes reasoning based on:
- Interest alignment
- Budget fit
- Popularity metrics
- Customer ratings
- Occasion appropriateness

## 📊 Database Schema

### Gift Model
```javascript
{
  giftId: String,           // Unique identifier
  name: String,             // Gift name
  category: String,         // Gift category
  price: Number,            // Price in USD
  description: String,      // Detailed description
  affiliateLink: String,    // Product URL
  interests: [String],      // Matching interests
  occasions: [String],      // Suitable occasions
  ageGroups: [String],      // Target age groups
  relationships: [String],  // Suitable relationships
  popularityScore: Number,  // 0-100 popularity
  rating: Number,           // 1-5 star rating
  isEmergencyGift: Boolean  // Digital/instant delivery
}
```

### Session Model
```javascript
{
  sessionId: String,        // Unique session ID
  preferences: {            // User preferences
    relationship: String,
    occasion: String,
    budgetMin: Number,
    budgetMax: Number,
    ageRange: String,
    interests: [String]
  },
  recommendations: [{       // Generated recommendations
    giftId: String,
    name: String,
    price: Number,
    reason: String,
    matchScore: Number
  }],
  emailSent: Boolean,       // Email delivery status
  emailAddress: String      // Recipient email
}
```

## 🎨 Design System

### Colors
- **Primary**: #4A90E2 (Blue)
- **Accent**: #7ED321 (Green)
- **Background**: #f8f9fa
- **Text**: #333333
- **Gray**: #666666

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Headings**: 600-700 weight
- **Body**: 400 weight
- **Small Text**: 14px

### Components
- **Buttons**: 12px border-radius, hover animations
- **Cards**: 16px border-radius, subtle shadows
- **Form Elements**: Consistent padding and styling
- **Progress Bar**: Gradient background

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: Security headers for production
- **Input Validation**: Comprehensive request validation
- **MongoDB Injection Protection**: Mongoose schema validation

## 📧 Email Integration

### Gmail Setup (Recommended)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Use the app password in your `.env` file

### SMTP Setup
Configure any SMTP provider in your `.env` file with host, port, and credentials.

### Email Features
- **Beautiful HTML Templates**: Responsive email design
- **Fallback Text**: Plain text version included
- **Personalization**: Custom content based on preferences
- **Error Handling**: Graceful email delivery failures

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
npm install --production

# Set environment variables
export NODE_ENV=production
export MONGODB_URI=your-mongodb-atlas-uri
export EMAIL_USER=your-email
export EMAIL_PASS=your-password

# Start server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
```

### Environment Variables
```env
# Production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/giftgenius
FRONTEND_URL=https://yourdomain.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Welcome screen loads correctly
- [ ] All form steps work with validation
- [ ] AI recommendations generate successfully
- [ ] Emergency mode shows digital gifts
- [ ] Email sending works
- [ ] Mobile responsiveness
- [ ] Error handling for edge cases

### API Testing
Use the health check endpoint to verify server status:
```bash
curl http://localhost:5000/health
```

Test the recommendation endpoint:
```bash
curl -X POST http://localhost:5000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "relationship": "friend",
    "occasion": "birthday",
    "budgetMin": 25,
    "budgetMax": 100,
    "ageRange": "18-30",
    "interests": ["technology"]
  }'
```

## 🛠️ Development

### Adding New Gifts
1. Edit `backend/scripts/seedDatabase.js`
2. Add new gift objects to the `gifts` array
3. Run `npm run seed` to update the database

### Modifying Recommendation Logic
1. Edit `backend/services/recommendationEngine.js`
2. Adjust weights in the constructor
3. Modify scoring algorithms as needed

### Frontend Customization
1. Update colors in `frontend/src/index.css`
2. Modify components in `frontend/src/components/`
3. Adjust API calls in `frontend/src/services/api.js`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Fails**
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure database permissions are correct

**Email Not Sending**
- Verify email credentials in `.env`
- Check spam folder
- Test with the `/api/email-recommendations/test` endpoint

**Frontend Not Loading**
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify API proxy configuration in `vite.config.js`

**No Recommendations Found**
- Check if database is seeded with gifts
- Verify filter criteria aren't too restrictive
- Review console logs for detailed errors

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📝 License

This project is for educational and demonstration purposes. Please review the license terms before commercial use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the API documentation
3. Check console logs for detailed error messages
4. Ensure all environment variables are configured correctly

---

Built with ❤️ using React, Node.js, Express, and MongoDB.