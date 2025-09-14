import express from 'express';
import nodemailer from 'nodemailer';
import { Session } from '../models/index.js';

const router = express.Router();

// Create nodemailer transporter
const createTransporter = () => {
  // Check if we have SMTP settings or Gmail settings
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // For development - use ethereal email (fake SMTP service)
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

/**
 * Generate HTML email template
 */
const generateEmailHTML = (recommendations, preferences) => {
  const relationshipLabels = {
    'family': 'Family Member',
    'friend': 'Friend',
    'colleague': 'Colleague',
    'partner': 'Partner'
  };

  const occasionLabels = {
    'birthday': 'Birthday',
    'holiday': 'Holiday',
    'anniversary': 'Anniversary',
    'thank-you': 'Thank You',
    'just-because': 'Just Because'
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your GiftGenius Recommendations</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo {
          font-size: 32px;
          font-weight: 700;
          color: #4A90E2;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #666;
          font-size: 16px;
        }
        .preferences {
          background: #f0f7ff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
        }
        .preferences h3 {
          color: #4A90E2;
          margin-top: 0;
        }
        .gift-card {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          transition: border-color 0.2s;
        }
        .gift-card:hover {
          border-color: #4A90E2;
        }
        .gift-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        .gift-price {
          background: #7ED321;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 12px;
        }
        .gift-reason {
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .gift-match {
          background: #f0f7ff;
          color: #4A90E2;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 16px;
        }
        .view-button {
          background: #4A90E2;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: background-color 0.2s;
        }
        .view-button:hover {
          background: #357ABD;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e9ecef;
          color: #666;
          font-size: 14px;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .container {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎁 GiftGenius</div>
          <div class="subtitle">Your Personalized Gift Recommendations</div>
        </div>

        <div class="preferences">
          <h3>Your Preferences</h3>
          <p><strong>Shopping for:</strong> ${relationshipLabels[preferences.relationship]}</p>
          <p><strong>Occasion:</strong> ${occasionLabels[preferences.occasion]}</p>
          <p><strong>Budget:</strong> ₹${preferences.budgetMin} - ₹${preferences.budgetMax}</p>
          <p><strong>Age Range:</strong> ${preferences.ageRange.replace('-', ' to ')}</p>
          <p><strong>Interests:</strong> ${preferences.interests.join(', ')}</p>
        </div>

        <h2 style="color: #4A90E2; margin-bottom: 24px;">Your Top Gift Recommendations</h2>

        ${recommendations.map((gift, index) => `
          <div class="gift-card">
            <h3 class="gift-name">${gift.name}</h3>
            <div class="gift-price">₹${gift.price}</div>
            <p class="gift-reason">${gift.reason}</p>
            ${gift.matchScore ? `<div class="gift-match">${gift.matchScore}% Match</div>` : ''}
            <a href="${gift.affiliateLink}" class="view-button" target="_blank">View Product</a>
          </div>
        `).join('')}

        <div class="footer">
          <p>Happy gifting from the GiftGenius team! 🎁</p>
          <p>These recommendations were generated based on your preferences and our AI algorithm.</p>
          <p><em>This email was sent because you requested gift recommendations from GiftGenius.</em></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * POST /api/email-recommendations
 * Send recommendations via email
 */
router.post('/', async (req, res) => {
  try {
    const { email, recommendations, preferences, sessionId } = req.body;

    // Validate required fields
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Valid email address is required'
      });
    }

    if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
      return res.status(400).json({
        error: 'Recommendations array is required and cannot be empty'
      });
    }

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        error: 'Preferences object is required'
      });
    }

    console.log(`Sending email to: ${email} with ${recommendations.length} recommendations`);

    // Create email transporter
    const transporter = createTransporter();

    // Generate email content
    const htmlContent = generateEmailHTML(recommendations, preferences);
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'giftgenius@example.com',
      to: email,
      subject: '🎁 Your Personalized Gift Recommendations from GiftGenius',
      html: htmlContent,
      text: `Your GiftGenius Recommendations\n\n${recommendations.map((gift, index) => 
        `${index + 1}. ${gift.name} - $${gift.price}\n   ${gift.reason}\n   View: ${gift.affiliateLink}\n`
      ).join('\n')}`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    // Update session if sessionId provided
    if (sessionId) {
      try {
        await Session.findOneAndUpdate(
          { sessionId },
          { 
            emailSent: true, 
            emailAddress: email,
            updatedAt: new Date()
          }
        );
      } catch (sessionError) {
        console.warn('Could not update session:', sessionError.message);
      }
    }

    res.json({
      success: true,
      message: 'Recommendations sent successfully',
      email,
      recommendationCount: recommendations.length,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Handle specific nodemailer errors
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        error: 'Email authentication failed',
        message: 'Please check email configuration settings'
      });
    }

    if (error.code === 'ECONNECTION') {
      return res.status(500).json({
        error: 'Email connection failed',
        message: 'Could not connect to email server'
      });
    }

    res.status(500).json({
      error: 'Failed to send email',
      message: error.message
    });
  }
});

/**
 * POST /api/email-recommendations/test
 * Test email configuration
 */
router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Valid email address is required for testing'
      });
    }

    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();

    // Send test email
    const testMailOptions = {
      from: process.env.EMAIL_USER || 'giftgenius@example.com',
      to: email,
      subject: '🧪 GiftGenius Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4A90E2;">🎁 GiftGenius Email Test</h2>
          <p>This is a test email to verify that your email configuration is working correctly.</p>
          <p>If you received this email, the email system is set up properly!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
        </div>
      `,
      text: 'GiftGenius Email Test - If you received this email, the email system is working correctly!'
    };

    const info = await transporter.sendMail(testMailOptions);

    res.json({
      success: true,
      message: 'Test email sent successfully',
      email,
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Email test error:', error);
    
    res.status(500).json({
      error: 'Email test failed',
      message: error.message,
      code: error.code
    });
  }
});

export default router;